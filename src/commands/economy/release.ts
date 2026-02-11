import { Time } from '@sapphire/timestamp'
import { Cooldown } from '@slipher/cooldown'
import { type CommandContext, Declare, Middlewares } from 'seyfert'
import { ExtendedSubCommand } from '../extended_base.ts'
import { ReleaseSubcommand } from '#subcommands/economy/release.ts'

@Declare({
  name: 'release',
  description:
    'Release your prey from their prison, allowing them to run free and earning some money from it.',
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
export default class ReleaseSubCommand extends ExtendedSubCommand {
  public override async run(ctx: CommandContext) {
    await new ReleaseSubcommand().run(ctx)
  }
}
