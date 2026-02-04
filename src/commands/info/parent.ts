import { env } from 'node:process'
import { Declare, Command, AutoLoad } from 'seyfert'

@Declare({
  name: 'info',
  description: 'Info commands',
  guildId:
    env['NODE_ENV'] === 'development' && env['DEV_GUILD_ID']
      ? [env['DEV_GUILD_ID']]
      : [],
})
@AutoLoad()
export default class InfoGroup extends Command {}
