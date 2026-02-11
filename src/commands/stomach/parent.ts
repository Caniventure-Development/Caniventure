import { AutoLoad, Command, Declare, Middlewares } from 'seyfert'
import { getGuildIds } from '#utilities/base.ts'

@AutoLoad()
@Declare({
  name: 'stomach',
  description: 'Stomach commands',
  guildId: getGuildIds()
})
@Middlewares(['hasDocument'])
export default class StomachGroup extends Command {}
