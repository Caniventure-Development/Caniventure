import { Command, Declare, AutoLoad } from 'seyfert'
import { getGuildIds } from '#utilities/base.ts'

@Declare({
  name: 'economy',
  description: 'Economy commands',
  guildId: getGuildIds()
})
@AutoLoad()
export default class EconomyGroup extends Command {}
