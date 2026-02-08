import { titleCase } from '@luca/cases'
import type { AutocompleteInteraction } from 'seyfert'
import type { APIApplicationCommandOptionChoice } from 'seyfert/lib/types/index'
import AutocompleteCommand from '../autocomplete.ts'
import npcs from '#base/npcs.ts'

export default class HuntingTargetAutocomplete extends AutocompleteCommand {
  public override async run(interaction: AutocompleteInteraction) {
    const focused = interaction.getInput().toLowerCase()

    const matches = npcs
      .filter(
        (npc) =>
          npc.species.toLowerCase().includes(focused) ||
          npc.size[0].toLowerCase().includes(focused) ||
          npc.size[1] === Number(focused)
      )
      .sort((a, b) => a.size[1] - b.size[1]) // Ascending
      .slice(0, 25)
      .map<APIApplicationCommandOptionChoice>((npc) => ({
        name: `${titleCase(npc.species)} (${npc.size[0]}, takes ${npc.size[1]} space)`,
        value: npc.species,
      }))

    return interaction.respond(matches)
  }
}
