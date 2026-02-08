import { type CommandContext, Declare, SubCommand } from 'seyfert'
import { PingSubcommand } from '#subcommands/info/ping.ts'

@Declare({
  name: 'ping',
  description: 'Check if the bot is alive.',
})
export default class PingSubCommand extends SubCommand {
  async run(ctx: CommandContext) {
    await new PingSubcommand().run(ctx)
  }
}
