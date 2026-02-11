import { AutoLoad, Command, Declare, Middlewares } from 'seyfert'
import { getGuildIds } from '#utilities/base.ts'

@Declare({
  name: 'owner-only',
  description: 'Owner Only commands',
  guildId: getGuildIds(),
})
@AutoLoad()
@Middlewares(['ownerOnly'])
export default class OwnerOnlyGroup extends Command {}
