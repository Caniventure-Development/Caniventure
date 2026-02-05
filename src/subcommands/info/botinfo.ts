import type { CommandContext } from 'seyfert'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class BotinfoSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext): Promise<void> {
    ctx.deferReply(true)
    ctx.editOrReply({
      content: 'Coming soon!',
    })
  }
}
