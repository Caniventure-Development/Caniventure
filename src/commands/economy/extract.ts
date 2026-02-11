import { type CommandContext, Declare, Middlewares } from 'seyfert'
import { ExtendedSubCommand } from '../extended_base.ts'
import { ExtractSubcommand } from '#subcommands/economy/extract.ts'

@Declare({
  name: 'extract',
  description:
    'Remove all the bones from your gurgling depths to use on upgrades and stuff!',
})
@Middlewares([
  'cooldown',
  'hasDocument',
  'hasTutorialDone',
  'isNotDigesting',
  'isNotRegurgitating',
  'isNotInPvp',
  'isNotSwallowed',
])
export default class ExtractSubCommand extends ExtendedSubCommand {
  public override async run(ctx: CommandContext) {
    await new ExtractSubcommand().run(ctx)
  }
}
