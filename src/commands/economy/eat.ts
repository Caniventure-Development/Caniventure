import {
  type CommandContext,
  createUserOption,
  Declare,
  Middlewares,
  Options,
  SubCommand,
} from 'seyfert'
import {
  EatSubcommandWithUser,
  EatSubcommandWithoutUser,
} from '#subcommands/economy/eat.ts'

const options = {
  user: createUserOption({
    description:
      'The user to attempt to swallow, if not provided, defaults to an AI opponent',
  }),
}

@Declare({
  name: 'eat',
  description: 'Swallow an opponent or another user',
})
@Options(options)
@Middlewares(['ensureDocument', 'ensureTutorialDone', 'ensureNotFull'])
export default class EatSubCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    const commandName = 'eat'
    await (ctx.options.user
      ? new EatSubcommandWithUser(commandName).run(ctx, ctx.options.user)
      : new EatSubcommandWithoutUser(commandName).run(ctx))
  }
}
