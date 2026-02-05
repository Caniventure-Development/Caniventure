import { Time } from '@sapphire/timestamp'
import type { CommandContext, User as SeyfertUser } from 'seyfert'
import type {
  CollectorInteraction,
  CreateComponentCollectorResult,
} from 'seyfert/lib/components/handler'
import type { APIEmbedFooter } from 'seyfert/lib/types/index'
import type { TutorialSection, TutorialSectionContent } from './section'
import {
  TutorialCharacterSection,
  TutorialHuntingSection,
  TutorialIntroSection,
  TutorialPreySection,
  TutorialStomachSection,
  TutorialVoraciousSection,
} from './sections/index.ts'
import type { User } from '#entities/user/user.entity.ts'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'
import type { UserCharacter } from '#base/entities/user/character.entity.ts'

export class TutorialSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { author, ui, utilities } = ctx
    const user = (await utilities.userDocuments.getUser(author.id))!
    const character = await user.getActiveCharacter()
    const introSection = this.sections[0]

    if (!introSection)
      throw new Error('No sections were provided for the tutorial!')

    const intro = introSection.getContent()

    const embed = ui.embeds.info(intro.title, {
      description: this.getTutorialDescription(intro, author, character),
      footer: this.tutorialSectionFooter(0, this.sections.length),
    })

    const actionRow = ui.actionRows.multiComponents(
      ui.buttons.primary(this.nextButtonId, "All right, let's go!"), // eslint-disable-line @stylistic/quotes
      ui.buttons.secondary(this.exitButtonId, 'I can do this alone, thanks')
    )

    const message = await ctx.editResponse({
      components: [actionRow],
      embeds: [embed],
    })

    const collector = utilities.collectors.create(
      ctx.interaction,
      message,
      'button',
      {
        timeout: Time.Minute * 3,
      }
    )

    this.handleTutorialCollector(ctx, collector, user, character, 0)
  }

  private async handleExitOrFinish(
    ctx: CommandContext,
    interaction: CollectorInteraction,
    user: User,
    wasExit = false
  ) {
    await interaction.deferUpdate()

    const { author, ui } = ctx
    const { em } = ctx.client

    user.hasDoneTutorial = true

    em.flush()

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
    character: UserCharacter,
    sectionIndex: number
  ) {
    const { ui, utilities } = ctx
    const { sections } = this
    const isLastSection = sectionIndex === sections.length - 1

    collector.run(this.nextButtonId, async (interaction) => {
      collector.stop()

      if (isLastSection) {
        await this.handleExitOrFinish(ctx, interaction, user)
        return
      }

      await interaction.deferUpdate()

      const nextIndex = sectionIndex + 1
      const nextSection = sections[nextIndex]

      if (!nextSection)
        throw new Error(`Invalid section index provided ${nextIndex}`)

      const content = nextSection.getContent()

      const nextActionRow = ui.actionRows.multiComponents(
        ui.buttons.primary(this.nextButtonId, 'Next'),
        ui.buttons.secondary(this.exitButtonId, 'Exit Tutorial')
      )

      await interaction.editOrReply({
        components: [nextActionRow],
        embeds: [
          ui.embeds.info(content.title, {
            description: this.getTutorialDescription(
              content,
              ctx.author,
              character
            ),
            footer: this.tutorialSectionFooter(nextIndex, sections.length),
          }),
        ],
      })
      const message = await interaction.fetchResponse()

      collector = utilities.collectors.create(
        ctx.interaction,
        message,
        'button',
        {
          timeout: Time.Minute * 3,
        }
      )

      this.handleTutorialCollector(ctx, collector, user, character, nextIndex)
    })

    collector.run(this.exitButtonId, async (interaction) => {
      collector.stop()
      this.handleExitOrFinish(ctx, interaction, user, true)
    })
  }

  private getTutorialDescription(
    content: TutorialSectionContent,
    author: SeyfertUser,
    character: UserCharacter
  ) {
    return content.description
      .replaceAll('{author}', author.username)
      .replaceAll('{character}', character.name)
      .replaceAll('{species}', character.species)
      .replaceAll('{bio}', character.bio)
  }

  private get sections(): TutorialSection[] {
    return [
      new TutorialIntroSection(),
      new TutorialCharacterSection(),
      new TutorialStomachSection(),
      new TutorialVoraciousSection(),
      new TutorialHuntingSection(),
      new TutorialPreySection(),
    ]
  }

  private get nextButtonId() {
    return 'proceed'
  }

  private get exitButtonId() {
    return 'exit'
  }

  private tutorialSectionFooter(
    sectionIndex: number,
    max: number
  ): APIEmbedFooter {
    return {
      text: `Page ${sectionIndex + 1} of ${max} | You have 3 minutes to select an option`,
    }
  }
}
