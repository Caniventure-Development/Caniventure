import { AutoLoad, Command, Declare } from 'seyfert'
import { getGuildIds } from '#utilities/base.ts'

@AutoLoad()
@Declare({
  name: 'economy',
  description: 'Economy commands',
  guildId: getGuildIds(),
})
export default class EconomyGroup extends Command {}
