import { type CommandContext, Declare, Middlewares, SubCommand } from 'seyfert'
import { StartSubcommand } from '#subcommands/economy/start.ts'

@Declare({
  name: 'start',
  description:
    'Start understanding the unique parts of Vorasion by making a profile!',
})
@Middlewares(['hasNoDocument'])
export default class StartSubCommand extends SubCommand {
  async run(ctx: CommandContext) {
    await new StartSubcommand().run(ctx)
  }
}
