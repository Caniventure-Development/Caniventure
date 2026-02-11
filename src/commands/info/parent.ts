import { Declare, Command, AutoLoad } from 'seyfert'
import { getGuildIds } from '#utilities/base.ts'

@Declare({
  name: 'info',
  description: 'Info commands',
  guildId: getGuildIds()
})
@AutoLoad()
export default class InfoGroup extends Command {}
