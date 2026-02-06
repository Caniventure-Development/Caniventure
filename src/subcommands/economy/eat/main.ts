import type { CommandContext, InteractionGuildMember, User } from 'seyfert'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class EatSubcommand extends BaseBotChatInputSubcommand {
  public override async run(
    ctx: CommandContext,
    _user: InteractionGuildMember | User
  ) {
    await this.notImplemented(ctx, ctx.interaction)
  }
}
