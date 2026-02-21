import type { CommandContext, MenuCommandContext } from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'
import { CHECK_FAILED_EMBED_TITLES } from '#base/check_failed_embed_titles.constant.ts'

export async function onMiddlewaresError(
  // biome-ignore lint/suspicious/noExplicitAny: This is intentional for Seyfert, apparently they defined the function like this. Understand never, ask questions never.
  context: CommandContext | MenuCommandContext<any, never>,
  error: string
) {
  const { ui, utilities } = context
  const { random } = utilities

  const failureEmbed = ui.embeds.error(random.item(CHECK_FAILED_EMBED_TITLES), {
    description: error,
  })

  await context.editOrReply({
    embeds: [failureEmbed],
    flags: MessageFlags.Ephemeral,
  })
}
