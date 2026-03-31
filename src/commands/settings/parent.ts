import { AutoLoad, Command, Declare, Middlewares } from 'seyfert'
import { getGuildIds } from '#utilities/base.ts'

@AutoLoad()
@Declare({
  name: 'settings',
  description: 'Settings commands',
  guildId: getGuildIds(),
})
@Middlewares(['hasDocument'])
export default class SettingsGroup extends Command {}
