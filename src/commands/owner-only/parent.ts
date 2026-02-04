import { env } from 'node:process'
import {
  Declare,
  Command,
  AutoLoad,
  Middlewares,
} from 'seyfert'

@Declare({
  name: 'owner-only',
  description: 'Owner Only commands',
  guildId:
    env['NODE_ENV'] === 'development' && env['DEV_GUILD_ID']
      ? [env['DEV_GUILD_ID']]
      : [],
})
@AutoLoad()
@Middlewares(['ownerOnly'])
export default class OwnerOnlyGroup extends Command {}
