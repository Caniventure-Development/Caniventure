import { type CommandContext, Declare, SubCommand } from 'seyfert'
import { HelpSubcommand } from '#subcommands/info/help.ts'

@Declare({
  name: 'help',
  description: 'Get information on all the commands Caniventure can provide!',
})
export default class HelpSubCommand extends SubCommand {
  async run(ctx: CommandContext) {
    await new HelpSubcommand().run(ctx)
  }
}
