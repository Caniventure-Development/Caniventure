import { Buffer } from 'node:buffer'
import { Time } from '@sapphire/timestamp'
import { AttachmentBuilder, type CommandContext } from 'seyfert'
import type { CollectorInteraction } from 'seyfert/lib/components/handler'
import { ButtonStyle } from 'seyfert/lib/types'
import { RULES } from '#base/bot_rules.constant.ts'
import { CONSTANTS, startCollectorId } from '#base/constants.ts'
import { storedCollectors } from '#base/stored-collectors.ts'
import { ComponentType } from '#base/types.ts'
import {
  BaseBotChatInputSubcommand,
  type EnsureAgreedOptions,
} from '#subcommands/index.ts'

const rulesTimeoutMultiplier = 3
const rulesTimeout = Time.Minute * rulesTimeoutMultiplier

export class StartSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { ui } = ctx

    const rulesEmbed = ui.embeds.info('Welcome to Vorasion', {
      description: RULES,
      footer: {
        text: this.timeoutText,
      },
    })
    const actionRow = ui.actionRows.predefined.confirmCancel(
      'agree',
      'disagree',
      'I Agree',
      'I Disagree'
    )

    const message = await ctx.editResponse({
      embeds: [rulesEmbed],
      components: [actionRow],
    })

    const collector = ctx.utilities.collectors.create(
      ctx.interaction,
      message,
      ComponentType.Button,
      {
        timeout: rulesTimeout,
      }
    )

    await this.ensureAgreed(
      ctx,
      collector,
      async (interaction) => this.handleStartCommandStepTwo(ctx, interaction),
      this.decliningOptions
    )
  }

  private async handleStartCommandStepTwo(
    ctx: CommandContext,
    interaction: CollectorInteraction
  ) {
    await interaction.deferUpdate()

    const { ui } = ctx

    const attachment = new AttachmentBuilder()
      .setName('RULES.md')
      .setFile('buffer', Buffer.from(RULES))

    const finalWarningEmbed = ui.embeds.danger('FINAL WARNING', {
      description:
        'You have clicked the agree button, this means you understand the idea of this bot and are fine with it. You have one last chance to turn back, **ARE YOU SURE YOU AGREE WITH THE RULES?**',
      footer: {
        text: this.timeoutText,
      },
    })

    const actionRow = ui.actionRows.multiComponents(
      ui.buttons.checkMarked('agree', "I'm sure, let me in!"),
      ui.buttons.crossed(
        'disagree',
        'Nope, I changed my mind!',
        ButtonStyle.Secondary
      )
    )

    const message = await interaction.editResponse({
      components: [actionRow],
      embeds: [finalWarningEmbed],
      files: [attachment],
    })

    const collector = ctx.utilities.collectors.create(
      ctx.interaction,
      message,
      ComponentType.Button,
      {
        timeout: rulesTimeout,
      }
    )

    await this.ensureAgreed(
      ctx,
      collector,
      async (interaction) =>
        this.handleStartCommandCharacterCreation(ctx, interaction),
      this.decliningOptions
    )
  }

  private async handleStartCommandCharacterCreation(
    ctx: CommandContext,
    interaction: CollectorInteraction
  ) {
    await interaction.deferUpdate()

    const { ui } = ctx

    const creatingEmbed = ui.embeds.info('Character Creation', {
      description:
        "All right! You've been warned, let's get through the rest of the setup. Next, you must set up a character! Click the button below to open the character creation modal!",
      footer: {
        text: "You have 10 minutes to run through the modal. This message will update when you're done.",
      },
    })
    const modal = ctx.utilities.modals.characterCreationModal(ctx)

    const modalOpeningId = CONSTANTS['OPEN_MODAL_ID']
    const actionRow = ui.actionRows.singleComponent(
      ui.buttons.primary(modalOpeningId, 'Open Creation Modal')
    )

    const message = await interaction.editResponse({
      attachments: [],
      components: [actionRow],
      embeds: [creatingEmbed],
    })

    const collector = ctx.utilities.collectors.create(
      ctx.interaction,
      message,
      ComponentType.Button,
      {
        timeout: Time.Minute * 10,
      }
    )
    storedCollectors.set(startCollectorId(ctx.author.id), collector)

    collector.run(modalOpeningId, async (interaction) =>
      interaction.modal(modal)
    )
  }

  private get decliningOptions(): EnsureAgreedOptions {
    return {
      embedDescription:
        'Sorry, until you accept the rules, you will not be able to use Vorasion.',
    }
  }

  private get timeoutText() {
    return `You have ${rulesTimeoutMultiplier} minutes to respond.`
  }
}
