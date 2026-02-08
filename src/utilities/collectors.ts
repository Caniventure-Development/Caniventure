import type {
  CollectorInteraction,
  CreateComponentCollectorResult,
} from 'seyfert/lib/components/handler'
import type {
  Interaction,
  ListenerOptions,
  Message,
  WebhookMessage,
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types/index'
import { BaseUtilityWithContext } from './base.ts'

type ComponentType = 'button' | 'select'

export class CollectorsUtility extends BaseUtilityWithContext {
  public timedOutEmbed(
    title: string | undefined = 'Timed Out',
    description: string | undefined = 'This collector has timed out.'
  ) {
    return this.embeds.warning(title, {
      description,
    })
  }

  public create<T extends Interaction, M extends Message | WebhookMessage>(
    interaction: T,
    message: M,
    componentType: ComponentType,
    options?: Omit<ListenerOptions, 'filter'>,
    refreshOnStop = false
  ): CreateComponentCollectorResult {
    return message.createComponentCollector({
      ...this.baseOptions(
        interaction,
        message.id,
        interaction.user.id,
        componentType,
        refreshOnStop
      ),
      ...options,
    })
  }

  private async filter(
    interaction: CollectorInteraction,
    expectedMessageId: string,
    expectedUserId: string,
    componentType: ComponentType,
    // eslint-disable-next-line @stylistic/quotes
    failureMessage = "That's not yours!"
  ) {
    if (interaction.message.id !== expectedMessageId) return false

    switch (componentType) {
      case 'button': {
        if (!interaction.isButton()) return false
        break
      }

      case 'select': {
        if (
          !(
            interaction.isChannelSelectMenu() ||
            interaction.isMentionableSelectMenu() ||
            interaction.isRoleSelectMenu() ||
            interaction.isStringSelectMenu() ||
            interaction.isUserSelectMenu()
          )
        )
          return false
        break
      }
    }

    if (interaction.user.id !== expectedUserId) {
      await interaction.write({
        content: failureMessage,
        flags: MessageFlags.Ephemeral,
      })

      return false
    }

    return true
  }

  private baseOptions<T extends Interaction>(
    interaction: T,
    expectedMessageId: string,
    expectedUserId: string,
    componentType: ComponentType,
    refreshOnStop = false,
    // eslint-disable-next-line @stylistic/quotes
    failureMessage = "That's not yours!",
  ): ListenerOptions {
    const timedOutEmbed = this.timedOutEmbed()

    return {
      filter: async (interaction) =>
        this.filter(
          interaction,
          expectedMessageId,
          expectedUserId,
          componentType,
          failureMessage
        ),
      async onStop(reason, refresh) {
        if (reason === 'timeout') {
          await interaction.editOrReply({
            embeds: [timedOutEmbed],
          })
          return
        }

        if (reason === 'idle' && refreshOnStop) refresh()
      },
    }
  }

  private get embeds() {
    return this.ui.embeds
  }
}
