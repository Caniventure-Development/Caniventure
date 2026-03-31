import { Time } from '@sapphire/timestamp'
import { type CommandContext, Declare, SubCommand } from 'seyfert'
import { CONSTANTS, createCollectorId } from '#base/constants.ts'
import { storedCollectors } from '#base/stored-collectors.ts'
import { ComponentType } from '#base/types.ts'

@Declare({
  name: 'new',
  description:
    "Create a new character (requires an account, use /economy start if you don't have one!)",
})
export default class CreateCharacterSubCommand extends SubCommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { interaction, ui, utilities } = ctx

    const creationEmbed = ui.embeds.info('Character Creation', {
      description:
        'Click the button below to create a brand new character for yourself!',
    })
    const actionRow = ui.actionRows.singleComponent(
      ui.buttons.primary(CONSTANTS['OPEN_MODAL_ID'], 'Open Creation Modal')
    )

    const message = await ctx.editOrReply(
      {
        components: [actionRow],
        embeds: [creationEmbed],
      },
      true
    )

    const collector = utilities.collectors.create(
      interaction,
      message,
      ComponentType.Button,
      {
        timeout: Time.Minute * 10,
      }
    )

    storedCollectors.set(createCollectorId(ctx.author.id), collector)

    const textDisplayText =
      'Time to create a new character! Fill out the information below to create a brand new character!'
    const isStartCommand = false
    collector.run(CONSTANTS['OPEN_MODAL_ID'], (interaction) =>
      interaction.modal(
        utilities.modals.characterCreationModal(
          ctx,
          textDisplayText,
          isStartCommand
        )
      )
    )
  }
}
