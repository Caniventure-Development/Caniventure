import { stripIndents } from 'common-tags'
import { ModalCommand, type ModalContext } from 'seyfert'
import { CONSTANTS } from '#base/constants.ts'

export default class StartSubcommandCharacterCreationModal extends ModalCommand {
  private get characterCreationModalConstants() {
    return CONSTANTS['CHARACTER_CREATION']
  }

  public override filter(ctx: ModalContext) {
    return ctx.customId === this.characterCreationModalConstants['MODAL_ID']
  }

  public override async run(ctx: ModalContext) {
    const { interaction, ui, utilities } = ctx
    const { characterCreationModalConstants } = this
    const { user } = interaction

    await interaction.deferUpdate()

    const name = interaction.getInputValue(
      characterCreationModalConstants['NAME_FIELD_ID'],
      true
    ) as string
    const speciesIdsSelected = interaction.getInputValue(
      characterCreationModalConstants['SPECIES_FIELD_ID'],
      true
    ) as string[]
    const speciesId = speciesIdsSelected[0]
    const bio = interaction.getInputValue(
      characterCreationModalConstants['BIO_FIELD_ID'],
      false
    ) as string | undefined

    const species = CONSTANTS['SPECIES_OPTIONS'].find(
      (species) => species.id === speciesId
    )

    if (!species) {
      const unknownSpeciesEmbed = ui.embeds.error('Invalid Species', {
        description:
          "You provided an invalid species, this shouldn't be possible. Blame my creator.", // eslint-disable-line @stylistic/quotes
      })

      await interaction.editOrReply({
        components: [],
        embeds: [unknownSpeciesEmbed],
      })
      return
    }

    const creatingEmbed = ui.embeds.info('Creating profile...', {
      description:
        "That should be all for now, I'm creating your data now... Give me a minute...", // eslint-disable-line @stylistic/quotes
    })

    await interaction.editOrReply({
      components: [],
      embeds: [creatingEmbed],
    })

    const creationResult = await utilities.userDocuments.createUser(user.id, {
      name,
      species: species.name,
      bio,
    })

    if (creationResult.isErr()) {
      const error = creationResult.unwrapErr()

      ctx.client.logger.error(error)

      const failedEmbed = ui.embeds.error('Failed to create user', {
        description:
          'Sorry, your data was not able to be pushed to the database for some reason.',
      })

      await interaction.editOrReply({
        embeds: [failedEmbed],
      })
      return
    }

    const doneEmbed = ui.embeds.success('All done!', {
      description: stripIndents`Welcome to Caniventure **${user.name}** _(or... should I say **${name}**)_!
        Make sure to use the \`/economy tutorial\` command before starting. Other commands won't work without it!`,
    })

    await interaction.editOrReply({
      embeds: [doneEmbed],
    })
  }
}
