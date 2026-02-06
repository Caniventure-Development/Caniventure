import type { Interaction } from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'
import { BaseUtility } from './base.ts'

export class HelpersUtility extends BaseUtility {
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

  public msToUnixTimestamp(ms: number): number {
    return Math.floor((Date.now() + ms) / 1000)
  }

  public getCodeBlockText(language: string, content: string): string {
    return `\`\`\`${language}\n${content}\n\`\`\``
  }
}
