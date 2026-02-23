import type { CommandContext } from 'seyfert'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'
import type { StomachHandleActions } from './actions'

export class StomachHandleSubcommand extends BaseBotChatInputSubcommand {
  public override async run(
    ctx: CommandContext,
    _action: StomachHandleActions
  ) {
    await this.notImplemented(ctx, ctx.interaction)
  }
}
