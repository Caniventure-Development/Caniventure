import { commaListsAnd } from 'common-tags'
import type {
  CommandContext,
  MenuCommandContext,
  PermissionStrings,
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'
import { CHECK_FAILED_EMBED_TITLES } from '#base/check_failed_embed_titles.constant.ts'

export async function onBotPermissionsFail(
  // biome-ignore lint/suspicious/noExplicitAny: This is intentional for Seyfert, apparently they defined the function like this. Understand never, ask questions never.
  context: CommandContext | MenuCommandContext<any, never>,
  permissions: PermissionStrings
) {
  const { ui, utilities } = context
  const { random } = utilities

  const missingPermissions = commaListsAnd`${permissions.map(
    (perm) => `\`${perm}\``
  )}`
  const commandName = context.command.name

  const failureEmbed = ui.embeds.error(random.item(CHECK_FAILED_EMBED_TITLES), {
    description: `Seems I'm missing some permissions to run the command \`${commandName}\`! I need the following permissions to run it: ${missingPermissions}`,
  })

  await context.editOrReply({
    embeds: [failureEmbed],
    flags: MessageFlags.Ephemeral,
  })
}
