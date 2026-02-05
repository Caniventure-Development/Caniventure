import { env } from 'node:process'
import { Command, Declare, AutoLoad } from 'seyfert'

@Declare({
  name: 'economy',
  description: 'Economy commands',
  guildId:
    env['NODE_ENV'] === 'development' && env['DEV_GUILD_ID']
      ? [env['DEV_GUILD_ID']]
      : [],
})
@AutoLoad()
export default class EconomyGroup extends Command {}
