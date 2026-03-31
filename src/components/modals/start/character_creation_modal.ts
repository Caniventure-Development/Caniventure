import type { UiClient } from '@discord-ui-kit/seyfert'
import { titleCase } from '@luca/cases'
import { Time } from '@sapphire/timestamp'
import { ModalCommand, type ModalContext } from 'seyfert'
import { CONSTANTS, startCollectorId } from '#base/constants.ts'
import { storedCollectors } from '#base/stored-collectors.ts'
import { ComponentType } from '#base/types.ts'
import type { UserCharacterRole } from '#entities/user/character.entity.ts'

function invalidPropertyEmbed(ui: UiClient, name: string) {
  return ui.embeds.error(`Invalid ${titleCase(name)}`, {
    description: `You provided an invalid ${name.toLowerCase()}, this shouldn't be possible. Blame my creator.`,
  })
}

export default class StartSubcommandCharacterCreationModal extends ModalCommand {
  private get characterCreationModalConstants() {
    return CONSTANTS['CHARACTER_CREATION']
  }

  public override filter(ctx: ModalContext) {
    return ctx.customId === this.characterCreationModalConstants['MODAL_ID']
  }

  public override async run(ctx: ModalContext) {
    const { client, interaction, ui, utilities } = ctx
    const { characterCreationModalConstants } = this
    const { user } = interaction

    const deferResult = await utilities.results.fromAsync(
      interaction.deferUpdate()
    )

    if (deferResult.isErr()) {
      client.logger.error('Failed to defer interaction, not deferring.')
      client.logger.error(deferResult.unwrapErr())
    }

    const key = startCollectorId(ctx.author.id)
    const storedCollector = storedCollectors.get(key)
    storedCollector?.stop()
    storedCollectors.delete(key)

    const name = interaction.getInputValue(
      characterCreationModalConstants['NAME_FIELD_ID'],
      true
    ) as string

    const speciesIdsSelected = interaction.getInputValue(
      characterCreationModalConstants['SPECIES_FIELD_ID'],
      true
    ) as string[]
    const speciesId = speciesIdsSelected.shift()
    const species = CONSTANTS['SPECIES_OPTIONS'].find(
      (species) => species.id === speciesId
    )

    const rolesSelected = interaction.getInputValue(
      characterCreationModalConstants['ROLE_FIELD_ID'],
      true
    ) as UserCharacterRole[]
    const role = rolesSelected.shift()

    const bio = interaction.getInputValue(
      characterCreationModalConstants['BIO_FIELD_ID'],
      false
    ) as string | undefined

    if (!role) {
      await interaction.editOrReply({
        components: [],
        embeds: [invalidPropertyEmbed(ui, 'role')],
      })
      return
    }

    if (!species) {
      await interaction.editOrReply({
        components: [],
        embeds: [invalidPropertyEmbed(ui, 'species')],
      })
      return
    }

    const alreadyExists =
      (await utilities.userDocuments.getUser(user.id)) !== null

    if (!alreadyExists) {
      const creationResult = await utilities.userDocuments.createUser(user.id, {
        name,
        species: species.name,
        role,
        bio,
      })

      if (creationResult.isErr()) {
        const error = creationResult.unwrapErr()

        client.logger.error(error)

        const failedEmbed = ui.embeds.error('Failed to create user', {
          description:
            'Sorry, your data was not able to be pushed to the database for some reason.',
        })

        await interaction.editOrReply({
          embeds: [failedEmbed],
        })
        return
      }
    }

    const almostDoneEmbed = ui.embeds.info('Almost Done', {
      description:
        'Last thing, we need a bit more information about your character. Click the button below to open another modal.',
    })
    const message = await interaction.editOrReply({
      embeds: [almostDoneEmbed],
    })

    const collector = utilities.collectors.create(
      // @ts-expect-error Should be fine, we aren't even using the modal property in this method. The rest of it should be fine.
      interaction,
      message,
      ComponentType.Button,
      {
        timeout: Time.Minute * 10,
      }
    )

    storedCollectors.set(key, collector)

    collector.run(CONSTANTS['OPEN_MODAL_ID'], async (interaction) => {
      interaction.modal(
        // @ts-expect-error Same reason as the last expect error. We aren't using all the properties in this method.
        utilities.modals.characterCreationLookInformationModal(ctx)
      )
    })
  }
}
