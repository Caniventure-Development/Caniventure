import { Time } from '@sapphire/timestamp'
import { Cooldown } from '@slipher/cooldown'
import { type CommandContext, Declare, Middlewares } from 'seyfert'
import { SubCommandWithLeveling } from '../base_with_leveling.ts'
import { HuntSubcommand } from '#subcommands/economy/hunt.ts'

@Cooldown({
  type: 'user',
  uses: { default: 1 },
  interval: Time.Minute * 3,
})
@Declare({
  name: 'hunt',
  description: 'Attempt to turn an NPC into a small snack',
})
@Middlewares(['ensureDocument', 'ensureTutorialDone', 'ensureNotFull'])
export default class HuntSubCommand extends SubCommandWithLeveling {
  public override async run(ctx: CommandContext) {
    // this.exclude()
    await new HuntSubcommand('hunt').run(ctx)
  }
}
