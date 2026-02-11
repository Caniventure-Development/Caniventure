import { titleCase } from '@luca/cases'
import { Time } from '@sapphire/timestamp'
import { stripIndents } from 'common-tags'
import type { CommandContext } from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'
import type { CaniventureNpc } from '#base/npcs.ts'
import StomachCharacter from '#base/utilities/stomach_character.ts'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class HuntSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext, npc: CaniventureNpc) {
    const { author, client, ui, utilities } = ctx
    const { helpers, random } = utilities
    const { wait } = helpers
    const em = client.em.fork()

    const user = (await utilities.userDocuments.getUser(author.id, {
      populate: ['stomach'],
    }))! // Confirmed not null by middleware.
    em.persist(user)

    const [size, space] = npc.size
    const { species } = npc
    const stomachSpace = user.stomach.capacity - user.stomach.currentSize
    const spaceLeft = stomachSpace - space

    if (spaceLeft < 0) {
      this.removeCooldown(ctx, author.id)
      const notEnoughRoomEmbed = ui.embeds.error('Not enough room!', {
        description: stripIndents`
            You spotted a ${size} ${species}, but your stomach grumbles. It doesn't have enough room to hold that!
            You'll just make yourself sick!

            ${
              stomachSpace === 0
                ? 'Your stomach is completely full, you might want to either digest your prey or release them.'
                : `Your stomach can only hold something that takes up ${stomachSpace} space, find smaller prey!`
            }

            ${StomachCharacter.full()}
          `,
      })

      await ctx.editOrReply({
        embeds: [notEnoughRoomEmbed],
        flags: MessageFlags.Ephemeral,
      })
      return
    }

    await ctx.deferReply()

    const adjectives = [
      'young',
      'skittish',
      'curious',
      'wandering',
      'lost',
      'hungry',
      'sleepy',
      'alert',
      'cautious',
      'brave',
      'foolish',
      'wild',
      'tame',
      'feral',
    ]
    const adjective = random.item(adjectives)
    const baseMessage = `You spotted a ${size} ${adjective} ${species}`
    const waitingMessage =
      "You're waiting for them to cross your path, imagining how good they will be..." // eslint-disable-line @stylistic/quotes
    const pouncingMessage =
      "They're in your sights, you pounce on them attempting to swallow them!" // eslint-disable-line @stylistic/quotes

    const spottedEmbed = ui.embeds.info('Prey Spotted', {
      description: stripIndents`
        ${baseMessage}.

        **${waitingMessage}**
      `,
    })

    await ctx.editOrReply({
      embeds: [spottedEmbed],
    })

    await wait(Time.Second * 5)

    const pouncingEmbed = ui.embeds.info('Prey In Range', {
      description: stripIndents`
        ${baseMessage}.

        ~~${waitingMessage}~~

        **${pouncingMessage}**
      `,
    })

    await ctx.editOrReply({
      embeds: [pouncingEmbed],
    })

    await wait(Time.Second * 3)

    const success = random.catchAttemptSuccess(space, user.level)

    if (!success) {
      const failedEmbed = ui.embeds.error('Hunt Failed', {
        description: stripIndents`
        ${baseMessage}.

        ~~${waitingMessage}~~

        ~~${pouncingMessage}~~

        **Sadly, they were too slippery and got out your grasp and fled. Your stomach is grumbling sadly from this mishap.**

        ${StomachCharacter.sad()}`,
      })

      await ctx.editOrReply({
        embeds: [failedEmbed],
      })
      return
    }

    const successEmbed = ui.embeds.success('That went well!', {
      description: stripIndents`
        ${baseMessage}.

        ~~${waitingMessage}~~

        ~~${pouncingMessage}~~

        **They tried to struggle free, but you eventually tired them out and swallowed them while letting out a satisfied belch once they landed.
        They're now in your stomach, and it's gurgling happily about this!**

        ${StomachCharacter.happy()}
      `,
    })

    user.stomach.addOpponent(titleCase(`${size} ${species}`), space)

    await em.flush()

    await ctx.editOrReply({
      embeds: [successEmbed],
    })
  }
}
