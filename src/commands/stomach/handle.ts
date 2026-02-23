import { titleCase } from '@luca/cases'
import {
  type CommandContext,
  createStringOption,
  Declare,
  Middlewares,
  Options,
  SubCommand,
} from 'seyfert'
import {
  StomachHandleActions,
  StomachHandleSubcommand,
} from '#subcommands/stomach/handle.ts'

const options = {
  action: createStringOption({
    description: 'The action to perform with your belly',
    required: true,
    choices: Object.values(StomachHandleActions).map((action) => ({
      name: titleCase(action),
      value: action,
    })),
  }),
}

@Declare({
  name: 'handle',
  description: 'Perform an action to your belly',
})
@Middlewares(['hasDocument'])
@Options(options)
export default class StomachHandleSubCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await new StomachHandleSubcommand().run(ctx, ctx.options.action)
  }
}
