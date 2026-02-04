import {
  type CommandContext,
  createStringOption,
  Declare,
  Options,
  SubCommand,
} from 'seyfert'
import { EvalSubcommand } from '#subcommands/owner-only/eval.ts'

const options = {
  code: createStringOption({
    description: 'The code to evaluate',
    required: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    min_length: 1,
  }),
}

@Declare({
  name: 'eval',
  description: 'Evaluate JavaScript/TypeScript code (owner only)',
})
@Options(options)
export default class EvalSubCommand extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    await new EvalSubcommand('eval').run(ctx, ctx.options.code)
  }
}
