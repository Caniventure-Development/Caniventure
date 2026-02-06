import type { CommandContext } from 'seyfert'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class HuntSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await this.notImplemented(ctx, ctx.interaction)
  }
}
