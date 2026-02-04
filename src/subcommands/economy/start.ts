import { Buffer } from 'node:buffer'
import {
  type CommandContext,
  AttachmentBuilder,
  StringSelectOption,
} from 'seyfert'
import { ButtonStyle, TextInputStyle } from 'seyfert/lib/types'
import { Time } from '@sapphire/timestamp'
import type { CollectorInteraction } from 'seyfert/lib/components/handler'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'
import { RULES } from '#base/bot_rules.constant.ts'
import { CONSTANTS } from '#base/constants.ts'

export class StartSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const rulesEmbed = ctx.ui.embeds.info('Welcome to Caniventure', {
      description: RULES,
      footer: {
        text: 'Click on a button saying whether you agree or disagree to these rules. You have 1 minute.',
      },
    })
    const actionRow = ctx.ui.actionRows.predefined.confirmCancel(
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
      'button',
      {
        timeout: Time.Minute,
      }
    )

    await this.ensureAgreed(
      ctx,
      collector,
      async (interaction) => this.handleStartCommandStepTwo(ctx, interaction),
      {
        embedDescription:
          'Sorry, until you accept the rules, you will not be able to use Caniventure.',
      }
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
        text: 'You have 1 minute to respond.',
      },
    })

    const actionRow = ui.actionRows.multiComponents(
      ui.buttons.checkMarked('agree', "I'm sure, let me in!"), // eslint-disable-line @stylistic/quotes
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
      'button',
      {
        timeout: Time.Minute,
      }
    )

    await this.ensureAgreed(ctx, collector, async (interaction) =>
      this.handleStartCommandCharacterCreation(ctx, interaction)
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
        "All right! You've been warned, let's get through the rest of the setup. Next, you must set up a character! Click the button below to open a modal!", // eslint-disable-line @stylistic/quotes
      footer: {
        text: "You have 10 minutes to run through the modal. This message will update when you're done.", // eslint-disable-line @stylistic/quotes
      },
    })

    const characterCreationModalConstants = CONSTANTS['CHARACTER_CREATION']
    const speciesOptions = CONSTANTS['SPECIES_OPTIONS']
    const modal = ui.modals
      .create(
        characterCreationModalConstants['MODAL_ID'],
        'Caniventure Character Creation'
      )
      .withTextDisplay(
        // eslint-disable-next-line @stylistic/quotes
        "Welcome to Caniventure, creating a character is very important to distinguish from small, simple minded humans! Let's create one!"
      )
      .withTextInput(characterCreationModalConstants['NAME_FIELD_ID'], {
        label: 'Character Name',
        placeholder: 'Dumara',
        description: 'Give us a name for your character!',
        style: TextInputStyle.Short,
        max: 50,
        required: true,
      })
      .withStringSelect(characterCreationModalConstants['SPECIES_FIELD_ID'], {
        label: 'Character Species',
        description: 'What species is your character?',
        values: speciesOptions
          .sort((a, b) => a.name.localeCompare(b.name)) // Alphabetical order
          .map((species) =>
            new StringSelectOption().setLabel(species.name).setValue(species.id)
          ),
        placeholder: 'Select one from here...',
        min: 1,
        max: 1,
        required: true,
      })
      .withTextInput(characterCreationModalConstants['BIO_FIELD_ID'], {
        label: 'Character Bio',
        description: 'A simple bio of your character, this is optional.',
        placeholder:
          'A soft, sweet, fluffy dragon with a big heart and an even bigger stomach.',
        style: TextInputStyle.Paragraph,
        max: 256,
        required: false,
      })
      .build()

    const modalOpeningId = 'open-modal'
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
      'button',
      {
        timeout: Time.Minute * 10,
      }
    )

    collector.run(modalOpeningId, async (interaction) => {
      collector.stop('Caught interaction!')
      interaction.modal(modal)
    })
  }
}
