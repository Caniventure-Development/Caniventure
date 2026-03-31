import type { AutocompleteInteraction } from 'seyfert'
import type { APIApplicationCommandOptionChoice } from 'seyfert/lib/types/index'
import { UserDocumentsUtility } from '#base/utilities/user_documents.ts'
import AutocompleteCommand from '../autocomplete.ts'

export default class CharacterAutocomplete extends AutocompleteCommand {
  public override async run(
    interaction: AutocompleteInteraction,
    excludePerma = true
  ) {
    const { client, user: interactionUser } = interaction
    const userDocuments = new UserDocumentsUtility(client)

    const user = await userDocuments.forceGetUser(interactionUser.id)
    const characters = await user.getCharacters()
    const activeCharacter = await user.getActiveCharacter()

    const input = interaction.getInput().toLowerCase()
    const matches = characters
      .filter(
        (character) =>
          (excludePerma ? !character.isPermad : true) &&
          (character.name.toLowerCase().includes(input) ||
            character.species.toLowerCase().includes(input) ||
            character.role.toLowerCase().includes(input))
      )
      .slice(0, 25)
      .map<APIApplicationCommandOptionChoice>((character) => ({
        name:
          character.characterId === activeCharacter.characterId
            ? `${character.name} (ACTIVE)`
            : character.name,
        value: character.characterId,
      }))

    return interaction.respond(matches)
  }
}
