import type { CommandContext } from 'seyfert'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class EatSubcommandWithoutUser extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await this.notImplemented(ctx, ctx.interaction)
  }
}
