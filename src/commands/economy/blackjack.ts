import { Time } from '@sapphire/timestamp'
import { Cooldown } from '@slipher/cooldown'
import { type CommandContext, Declare, Middlewares } from 'seyfert'
import { ExtendedSubCommand } from '../extended_base.ts'

@Declare({
  name: 'blackjack',
  description: 'Start playing a fun unique blackjack game!',
})
@Cooldown({
  type: 'user',
  uses: { default: 1 },
  interval: Time.Minute * 30,
})
@Middlewares([
  'cooldown',
  'hasDocument',
  'hasTutorialDone',
  'isNotDigesting',
  'isNotInPvp',
  'isNotRegurgitating',
  'isNotSwallowed',
  'bellyEmpty',
])
export default class BlackjackSubCommand extends ExtendedSubCommand {
  public override async run(ctx: CommandContext) {
    await ctx.utilities.helpers.handleNotImplemented(ctx.interaction)
  }
}
