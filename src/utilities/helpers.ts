import { CooldownType } from '@slipher/cooldown'
import type { AnyContext, Interaction } from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'
import { BaseUtilityWithContext } from './base.ts'

export class HelpersUtility extends BaseUtilityWithContext {
  public async handleNotImplemented<T extends Interaction>(
    interaction: T,
    message = 'Sorry, this method was not implemented yet! It should be ready soon though, maybe!'
  ) {
    const notImplementedEmbed = this.ui.embeds.danger('Not Implemented', {
      description: message,
    })

    const basePayload = {
      embeds: [notImplementedEmbed],
    }

    await interaction.editOrReply({
      ...basePayload,
      flags: MessageFlags.Ephemeral,
    })
  }

  /**
   * Waits for a specified amount of milliseconds before resolving.
   * @param ms The amount of milliseconds to wait.
   */
  public async wait(ms: number): Promise<void> {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public removeCooldown(
    ctx: AnyContext,
    id: string,
    cooldownType: CooldownType = CooldownType.User
  ) {
    if (!('fullCommandName' in ctx)) return

    const { fullCommandName } = ctx.client.handleCommand.getCommandFromContent(
      ctx.fullCommandName.split(' ').filter(Boolean).slice(0, 3) // eslint-disable-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    )

    if (
      !ctx.client.cooldown.has({
        name: fullCommandName,
        target: id,
      })
    )
      return

    ctx.client.cooldown.resource.remove(
      `${fullCommandName}:${cooldownType}:${id}`
    )
  }
}
