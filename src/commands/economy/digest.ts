import { Time } from '@sapphire/timestamp'
import { Cooldown } from '@slipher/cooldown'
import { type CommandContext, Declare, Middlewares } from 'seyfert'
import { ExtendedSubCommand } from '../extended_base.ts'
import { DigestSubcommand } from '#subcommands/economy/digest.ts'

@Declare({
  name: 'digest',
  description:
    'Melt your prey into nothing but an extra layer of fat and extra bones for your wallet',
})
@Cooldown({
  type: 'user',
  uses: { default: 1 },
  interval: Time.Minute * 15,
})
@Middlewares([
  'cooldown',
  'hasDocument',
  'hasTutorialDone',
  'isNotDigesting',
  'isNotRegurgitating',
  'isNotInPvp',
  'bellyOccupied',
  'isNotSwallowed',
])
export default class DigestSubCommand extends ExtendedSubCommand {
  public override async run(ctx: CommandContext) {
    await new DigestSubcommand().run(ctx)
  }
}
