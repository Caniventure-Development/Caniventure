/* eslint-disable no-eval */
import { Buffer } from 'node:buffer'
import { env } from 'node:process'
import util from 'node:util'
import { AttachmentBuilder, type CommandContext } from 'seyfert'
import { Stopwatch } from '@sapphire/stopwatch'
import type { APIEmbedFooter } from 'seyfert/lib/types/index'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class EvalSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext, code: string) {
    await ctx.deferReply()

    const executionTimeStopwatch = new Stopwatch().start()
    const evaluationResult = await ctx.utilities.results.fromAsync(async () => {
      const variableRegex = /(const|let|var)\b/

      if (code.includes('await') && variableRegex.test(code)) {
        // eslint-disable-next-line no-return-await, @typescript-eslint/no-unsafe-return
        return await eval(`(async (ctx) => {${code}})(ctx)`)
      }

      if (code.includes('await')) {
        // eslint-disable-next-line no-return-await, @typescript-eslint/no-unsafe-return
        return await eval(`(async (ctx) => ${code})(ctx)`)
      }

      if (variableRegex.test(code)) {
        // eslint-disable-next-line no-return-await, @typescript-eslint/no-unsafe-return
        return await eval(`(() => {${code}})()`)
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return eval(code)
    })
    executionTimeStopwatch.stop()

    const executionTime = executionTimeStopwatch.duration
    const footer: APIEmbedFooter = {
      text: `Took ${executionTime.toFixed(2)} milliseconds`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      icon_url: ctx.author.avatarURL({
        size: 128,
        extension: 'png',
      }),
    }

    if (evaluationResult.isErr()) {
      const error = evaluationResult.unwrapErr()

      const failureEmbed = ctx.ui.embeds.error('EVALUATION FAILED', {
        description: ctx.utilities.helpers.getCodeBlockText(
          'typescript',
          error.stack ?? error.message
        ),
        footer,
      })

      await ctx.editResponse({ embeds: [failureEmbed] })
      return
    }

    let output: string = evaluationResult.unwrap()

    if (typeof output !== 'string') {
      output = util.inspect(output, { depth: 2, colors: false })
    } else if (output === undefined) output = 'undefined'
    else output ??= 'null'

    const secrets = [env['BOT_TOKEN'], env['DATABASE_PASSWORD']]

    for (const secret of secrets) {
      if (!secret) continue

      output = output.replaceAll(secret, '[REDACTED]')
    }

    const outputCodeBlock = ctx.utilities.helpers.getCodeBlockText(
      'typescript',
      output
    )

    if (outputCodeBlock.length > 4096) {
      const evaluationAttachment = new AttachmentBuilder()
        .setName('output.ts')
        .setFile('buffer', Buffer.from(output))

      const successfulButTooLongEmbed = ctx.ui.embeds.success(
        'EVALUATION SUCCESSFUL',
        {
          description:
            'Output is too long to display in the message. Please check the attachment.',
          footer,
        }
      )

      await ctx.editResponse({
        embeds: [successfulButTooLongEmbed],
        files: [evaluationAttachment],
      })
      return
    }

    const resultEmbed = ctx.ui.embeds.success('EVALUATION RESULT', {
      description: outputCodeBlock,
      footer,
    })

    await ctx.editResponse({ embeds: [resultEmbed] })
  }
}
