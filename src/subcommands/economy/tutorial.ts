import { Time } from '@sapphire/timestamp'
import { stripIndents } from 'common-tags'
import type { CommandContext, ComponentCallback } from 'seyfert'
import type {
  CollectorInteraction,
  CreateComponentCollectorResult,
} from 'seyfert/lib/components/handler'
import type { User } from '#entities/user/user.entity.ts'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class TutorialSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { author, ui, utilities } = ctx
    const user = (await utilities.userDocuments.getUser(author.id))!
    const character = await user.getActiveCharacter()

    const tutorialIntroductionEmbed = ui.embeds.info('Caniventure Tutorial', {
      description: stripIndents`Welcome to Caniventure **${author.name}**! Or, as your current character is known... **${character.name}**!
      This whole command is meant to get you all set up to learn what this bot is about before you go all out on everything.
      Keep in mind this bot is still in development, and things are still subject to change.

      If you're sure you can do this alone (or if you've already run through this), you can click the secondary Exit button. Otherwise, click the Primary button.
      `,
      footer: {
        text: 'You have 3 minutes to select an option',
      },
    })

    const actionRow = ui.actionRows.multiComponents(
      ui.buttons.primary(this.nextButtonId, "All right, let's go!"), // eslint-disable-line @stylistic/quotes
      ui.buttons.secondary('exit', 'I can do this alone, thanks')
    )

    const message = await ctx.editResponse({
      components: [actionRow],
      embeds: [tutorialIntroductionEmbed],
    })

    const collector = utilities.collectors.create(
      ctx.interaction,
      message,
      'button',
      {
        timeout: Time.Minute * 3,
      }
    )

    this.handleTutorialCollector(ctx, collector, user, async (interaction) =>
      this.caniventureTutorialCharacter(ctx, interaction, user)
    )
  }

  private async caniventureTutorialCharacter(
    ctx: CommandContext,
    interaction: CollectorInteraction,
    user: User
  ) {
    const { ui } = ctx

    await interaction.deferUpdate()

    const caniventureSidesEmbed = ui.embeds.info(
      'Your Character',
      {
        description: stripIndents``,
      }
    )

    await interaction.editOrReply({
      components: [this.getTutorialButtons(ctx)],
      embeds: [caniventureSidesEmbed],
    })
  }

  private getTutorialButtons(ctx: CommandContext) {
    const { ui } = ctx

    return ui.actionRows.singleComponent(
      ui.buttons.primary(this.nextButtonId, 'Next')
    )
  }

  private async handleExitOrFinish(
    ctx: CommandContext,
    interaction: CollectorInteraction,
    user: User,
    wasExit = false
  ) {
    await interaction.deferUpdate()

    const { author, ui } = ctx
    const em = ctx.client.orm.em.fork()

    user.hasDoneTutorial = true

    // This user is not persisted by this EntityManager.
    // So we have to persist it.
    em.persist(user).flush()

    const tutorialOverEmbed = ui.embeds.success(
      `Tutorial ${wasExit ? 'Exited' : 'Finished'}`,
      {
        description: `All right, the tutorial is over. Go ahead and enjoy Caniventure **${author.name}**, we won't judge! Have fun out there!`,
      }
    )

    await interaction.editOrReply({
      components: [],
      content: null,
      embeds: [tutorialOverEmbed],
    })
  }

  private handleTutorialCollector(
    ctx: CommandContext,
    collector: CreateComponentCollectorResult,
    user: User,
    onProceed: ComponentCallback<CollectorInteraction>
  ) {
    collector.run(this.nextButtonId, onProceed)

    collector.run('exit', async (interaction) =>
      this.handleExitOrFinish(ctx, interaction, user, true)
    )
  }

  private get nextButtonId() {
    return 'proceed'
  }
}
