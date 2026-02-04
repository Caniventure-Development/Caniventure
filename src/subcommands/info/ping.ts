import type { CommandContext } from 'seyfert'
import { Stopwatch } from '@sapphire/stopwatch'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class PingSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    const stopwatch = new Stopwatch().start()

    await ctx.write({ content: 'Pinging...' })

    stopwatch.stop()

    const pingEmbed = ctx.ui.embeds.info(null, {
      fields: [
        {
          name: 'Message Round Trip',
          value: `${stopwatch.toString()}`,
          inline: true,
        },
        {
          name: 'API Latency',
          value: `${ctx.client.gateway.latency}ms`,
          inline: true,
        },
      ],
    })

    await ctx.editResponse({
      content: 'Yep, totally alive!',
      embeds: [pingEmbed],
    })
  }
}
