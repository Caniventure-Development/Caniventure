import { Time } from '@sapphire/timestamp'
import type { CommandContext, InteractionGuildMember, User } from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'
import { EatSubcommandDiceMinigame } from './dice.minigame'

export class EatSubcommand extends BaseBotChatInputSubcommand {
  public override async run(
    ctx: CommandContext,
    user: InteractionGuildMember | User
  ) {
    const getUserMention = this.getUserMention
    await ctx.deferReply()

    const { author, client, ui, utilities } = ctx
    const { userDocuments } = utilities

    if (author.id === user.id) {
      this.clearCooldown(ctx)

      const cantEatYourselfEmbed = ui.embeds.error('Uh... no.', {
        description:
          "You can't just eat yourself, nor can I explain what would happen if you did. Pick someone else to eat!",
      })

      await ctx.editOrReply({ embeds: [cantEatYourselfEmbed] })
      return
    }

    if (user.bot) {
      this.clearCooldown(ctx)

      const preyIsBot = user.id === client.me.id
      const invalidUserEmbed = preyIsBot
        ? ui.embeds.error('Very funny...', {
            description:
              "If you tried to eat me, I'd just throw you against a wall and you'd be my lunch. Pick someone else!",
          })
        : ui.embeds.error('No, bad user!', {
            description:
              "You can't eat my friends! If anything, they would taste bad. Pick someone else!",
          })

      await ctx.editOrReply({ embeds: [invalidUserEmbed] })
      return
    }

    const predator = await userDocuments.forceGetUser(author.id)
    const prey = await userDocuments.getUser(user.id, {
      populate: ['settings', 'states'],
    })

    if (!prey) {
      this.clearCooldown(ctx)

      const noUserEmbed = ui.embeds.error('Invalid user', {
        description: `${user.username} does not have a Vorasion profile, you can't eat them!`,
      })

      await ctx.editOrReply({ embeds: [noUserEmbed] })
      return
    }

    if (!prey.hasDoneTutorial) {
      this.clearCooldown(ctx)

      const noTutorialEmbed = ui.embeds.error('Failure', {
        description: `Seriously? You want to eat ${user.username}, who hasn't even done the tutorial?! That's just cruel. Pick someone else to eat!`,
      })

      await ctx.editOrReply({ embeds: [noTutorialEmbed] })
      return
    }

    if (prey.isInStomach) {
      const captor = await prey.getCaptor(client)
      const baseMessage = `${user.username} is already in someone's stomach! You can't eat them!`
      const embedTitle = 'Failure'

      if (!captor) {
        const unknownCaptorEmbed = ui.embeds.error(embedTitle, {
          description: baseMessage,
        })

        await ctx.editOrReply({ embeds: [unknownCaptorEmbed] })
        return
      }

      const isCaptorPredator = captor?.id === predator.discordId

      const alreadyInStomachEmbed = ui.embeds.error(embedTitle, {
        description: isCaptorPredator
          ? `${user.username} is already in your stomach! You can't eat them again!`
          : `${user.username} is inside the stomach of ${captor.username}! You can't eat them!`,
      })

      await ctx.editOrReply({ embeds: [alreadyInStomachEmbed] })
      return
    }

    if (!prey.settings.pvpOn) {
      this.clearCooldown(ctx)

      const pvpOffEmbed = ui.embeds.error('PvP is off', {
        description: `${user.username} has PvP turned off, you can't eat them!`,
      })

      await ctx.editOrReply({ embeds: [pvpOffEmbed] })
      return
    }

    const preyConfirmationEmbed = ui.embeds.info('PvP Request', {
      description: `Hello ${getUserMention(user)}, ${getUserMention(author)} has challenged you to a PvP battle! Do you accept?`,
      fields: [
        {
          name: 'Accept',
          value:
            'If you accept, you will be thrown into a minigame with the predator. If you lose, **you will be lunch**. If you win, **you will turn the tables on the predator**.',
        },
        {
          name: 'Decline',
          value:
            'If you decline, the predator will go away and you will both be safe... for now.',
        },
      ],
    })

    const acceptCustomId = 'accept'
    const declineCustomId = 'decline'
    const actionRow = ui.actionRows.multiComponents(
      ui.buttons.success(acceptCustomId, "Sure, let's do this!"),
      ui.buttons.danger(
        declineCustomId,
        "I'd rather not be someone's lunch today, thanks"
      )
    )

    const shouldGetResponseBack = true
    const message = await ctx.editOrReply(
      {
        components: [actionRow],
        content: prey.settings.allowMentions ? getUserMention(user) : null,
        embeds: [preyConfirmationEmbed],
      },
      shouldGetResponseBack
    )

    const collector = message.createComponentCollector({
      timeout: Time.Minute * 3,
      filter: (interaction) => {
        if (!interaction.isButton()) return false

        if (interaction.user.id !== prey.discordId) {
          interaction.editOrReply({
            content:
              "This isn't for you! Only the challenged user can respond.",
            flags: MessageFlags.Ephemeral,
          })
          return false
        }

        return true
      },
    })

    this.ensureAgreed(
      ctx,
      collector,
      async (interaction) => {
        await interaction.deferUpdate()

        const gameUnderwayEmbed = ui.embeds.info('Game Underway', {
          description: `The PvP battle between ${getUserMention(
            author
          )} and ${getUserMention(user)} is starting now!`,
        })

        await interaction.editOrReply({
          components: [],
          embeds: [gameUnderwayEmbed],
        })

        new EatSubcommandDiceMinigame().run(interaction, ctx, [
          [author, predator],
          [user, prey],
        ])
      },
      {
        agreeCustomId: acceptCustomId,
        disagreeCustomId: declineCustomId,
        embedTitle: 'Challenge Declined',
        embedDescription: `${getUserMention(user)} has declined the PvP challenge. Better luck next time, ${getUserMention(
          author
        )}!`,
      }
    )
  }

  private clearCooldown(ctx: CommandContext) {
    this.removeCooldown(ctx, ctx.author.id)
  }
}
