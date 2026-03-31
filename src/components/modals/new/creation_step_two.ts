import { stripIndents } from 'common-tags'
import { ModalCommand, type ModalContext } from 'seyfert'
import { CONSTANTS, createCollectorId } from '#base/constants.ts'
import { storedCollectors } from '#base/stored-collectors.ts'
import type { UserCharacterMeasurementSystem } from '#entities/user/character.entity.ts'

export default class CreateSubcommandCharacterInformationModal extends ModalCommand {
  private get characterInformationModalConstants() {
    return CONSTANTS['CHARACTER_INFORMATION']
  }

  public override filter(ctx: ModalContext) {
    return (
      ctx.customId ===
      `${this.characterInformationModalConstants['MODAL_ID']}-new`
    )
  }

  public override async run(ctx: ModalContext) {
    const { author, client, interaction, ui, utilities } = ctx

    const currentUser = await utilities.userDocuments.forceGetUser(author.id)
    const currentCharacter = await currentUser.getActiveCharacter()

    const parsingRadix = 10
    const em = client.orm.em.fork()
    em.persist(currentUser).persist(currentCharacter)

    const characterHeight = parseInt(
      interaction.getInputValue(
        this.characterInformationModalConstants['HEIGHT_FIELD_ID'],
        true
      ) as string,
      parsingRadix
    )
    const characterHeightUnit = interaction.getInputValue(
      `${this.characterInformationModalConstants['UNIT_PREFERENCE_FIELD_ID']}-height`,
      true
    ) as UserCharacterMeasurementSystem

    const characterWeight = parseInt(
      interaction.getInputValue(
        this.characterInformationModalConstants['WEIGHT_FIELD_ID'],
        true
      ) as string,
      parsingRadix
    )
    const characterWeightUnit = interaction.getInputValue(
      `${this.characterInformationModalConstants['UNIT_PREFERENCE_FIELD_ID']}-weight`,
      true
    ) as UserCharacterMeasurementSystem

    if (Number.isNaN(characterHeight) || Number.isNaN(characterWeight)) {
      const invalidDataEmbed = ui.embeds.error('Bad Data', {
        description:
          'The height or weight you entered was not a number, open the modal again and try again!',
      })

      await interaction.editOrReply({
        embeds: [invalidDataEmbed],
      })
      return
    }

    const deferResult = await utilities.results.fromAsync(
      interaction.deferUpdate()
    )

    if (deferResult.isErr())
      client.logger.error('Failed to defer interaction, not deferring.')

    const key = createCollectorId(ctx.author.id)
    const storedCollector = storedCollectors.get(key)
    storedCollector?.stop()
    storedCollectors.delete(key)

    const actualHeight = utilities.helpers.unitToImperial(
      characterHeight,
      characterHeightUnit,
      'height'
    )
    const actualWeight = utilities.helpers.unitToImperial(
      characterWeight,
      characterWeightUnit,
      'weight'
    )

    currentCharacter.height = actualHeight
    currentCharacter.initialHeight = actualHeight

    currentCharacter.weight = actualWeight
    currentCharacter.initialWeight = actualWeight

    const creatingEmbed = ui.embeds.info('Creating character...', {
      description: `All right, one moment... I'm adding ${currentCharacter.name} to the database...`,
    })

    await interaction.editOrReply({
      components: [],
      embeds: [creatingEmbed],
    })

    const finishingResult = await utilities.results.fromAsync(em.flush())

    if (finishingResult.isErr()) {
      const error = finishingResult.unwrapErr()

      client.logger.error(error)

      const failedEmbed = ui.embeds.error('Failure', {
        description:
          'Sorry, I seem to have failed to put the data into the database for some reason. This has been reported to the developers!',
      })

      await interaction.editOrReply({
        components: [],
        embeds: [failedEmbed],
      })
      return
    }

    const doneEmbed = ui.embeds.success('All done!', {
      description: stripIndents`
      Welcome to Vorasion **${author.name}** _(or... should I say **${currentCharacter.name}**)_!
      Your character is now ready to go!`,
    })

    await interaction.editOrReply({
      embeds: [doneEmbed],
    })
  }
}
