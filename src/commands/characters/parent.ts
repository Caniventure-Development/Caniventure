import { AutoLoad, Command, Declare } from 'seyfert'
import { getGuildIds } from '#utilities/base.ts'

@AutoLoad()
@Declare({
  name: 'characters',
  description: 'Character commands',
  guildId: getGuildIds(),
})
export default class CharactersGroup extends Command {}
