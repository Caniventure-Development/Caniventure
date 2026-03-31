import { titleCase } from '@luca/cases'
import type { AutocompleteInteraction } from 'seyfert'
import type { APIApplicationCommandOptionChoice } from 'seyfert/lib/types/index'
import npcs from '#base/npcs.ts'
import AutocompleteCommand from '../autocomplete.ts'

export default class HuntingTargetAutocomplete extends AutocompleteCommand {
  public override run(interaction: AutocompleteInteraction) {
    const focused = interaction.getInput().toLowerCase()

    const matches = npcs
      .filter((npc) => {
        const [sizeName, sizeNum] = npc.size

        return (
          npc.species.toLowerCase().includes(focused) ||
          sizeName.toLowerCase().includes(focused) ||
          sizeNum === Number(focused)
        )
      })
      .sort((a, b) => a.size[1] - b.size[1]) // Ascending
      .slice(0, 25)
      .map<APIApplicationCommandOptionChoice>((npc) => {
        const { species, size } = npc
        const [sizeName, sizeNum] = size

        return {
          name: `${titleCase(species)} (${sizeName}, takes ${sizeNum} space)`,
          value: species,
        }
      })

    return interaction.respond(matches)
  }
}
