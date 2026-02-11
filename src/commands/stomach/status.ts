import { type CommandContext, Declare, SubCommand } from 'seyfert'
import { StomachStatusSubcommand } from '#subcommands/stomach/status.ts'

@Declare({
  name: 'status',
  description:
    'View the status of your stomach, including the status of your prey.',
})
export default class StomachStatusSubCommand extends SubCommand {
  public override async run(ctx: CommandContext) {
    await new StomachStatusSubcommand().run(ctx)
  }
}
