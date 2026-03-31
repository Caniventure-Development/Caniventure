import { AutoLoad, Command, Declare } from 'seyfert'
import { getGuildIds } from '#utilities/base.ts'

@AutoLoad()
@Declare({
  name: 'info',
  description: 'Info commands',
  guildId: getGuildIds(),
})
export default class InfoGroup extends Command {}
