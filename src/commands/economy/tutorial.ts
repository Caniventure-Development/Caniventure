import { type CommandContext, Declare, Middlewares, SubCommand } from 'seyfert'
import { TutorialSubcommand } from '#subcommands/economy/tutorial.ts'

@Declare({
  name: 'tutorial',
  description:
    'Learn how Caniventure actually works, or just skip if you know already.',
})
@Middlewares(['hasDocument', 'hasTutorialNotDone'])
export default class TutorialSubCommand extends SubCommand {
  async run(ctx: CommandContext) {
    await new TutorialSubcommand().run(ctx)
  }
}
