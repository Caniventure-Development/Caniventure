import { Time } from '@sapphire/timestamp'
import { Cooldown } from '@slipher/cooldown'
import {
  type CommandContext,
  createUserOption,
  Declare,
  Middlewares,
  Options,
} from 'seyfert'
import { SubCommandWithLeveling } from '../base_with_leveling.ts'
import { EatSubcommand } from '#subcommands/economy/eat.ts'

const options = {
  user: createUserOption({
    description: 'The user to attempt to swallow',
    required: true,
  }),
}

@Declare({
  name: 'eat',
  description: 'Attempt to swallow another user',
})
@Cooldown({
  type: 'user',
  uses: { default: 1 },
  interval: Time.Minute * 5,
})
@Options(options)
@Middlewares([
  'cooldown',
  'hasDocument',
  'hasTutorialDone',
  'isNotFull',
  'isNotRegurgitating',
  'isNotDigesting',
  'isNotInPvp',
  'isNotSwallowed',
])
export default class EatSubCommand extends SubCommandWithLeveling {
  public override async run(ctx: CommandContext<typeof options>) {
    this.exclude()

    await new EatSubcommand().run(ctx, ctx.options.user)
  }
}
