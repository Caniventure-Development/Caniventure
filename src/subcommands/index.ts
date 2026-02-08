import type { CommandContext, Interaction } from 'seyfert'
import { CooldownType } from '@slipher/cooldown'
import type {
  CollectorInteraction,
  CreateComponentCollectorResult,
} from 'seyfert/lib/components/handler'
import type { Awaitable } from '@sapphire/utilities'

type EnsureAgreedOptions = {
  agreeCustomId?: string
  disagreeCustomId?: string
  embedTitle?: string
  embedDescription?: string
  stopAfterCatch?: boolean
}

abstract class BaseBotSubcommand {
  public removeCooldown(
    ctx: CommandContext,
    id: string,
    cooldownType: CooldownType = CooldownType.User
  ) {
    ctx.utilities.helpers.removeCooldown(ctx, id, cooldownType)
  }

  public async notImplemented<T extends Interaction>(
    ctx: CommandContext,
    interaction: T
  ) {
    await ctx.utilities.helpers.handleNotImplemented(interaction)
  }

  public async ensureAgreed(
    ctx: CommandContext,
    collector: CreateComponentCollectorResult,
    callback: (interaction: CollectorInteraction) => Promise<void>,
    options?: EnsureAgreedOptions
  ) {
    const stopAfterCatch = options?.stopAfterCatch ?? true

    collector.run(options?.agreeCustomId ?? 'agree', async (interaction) => {
      if (stopAfterCatch) collector.stop()

      await callback(interaction)
    })

    collector.run(
      options?.disagreeCustomId ?? 'disagree',
      async (interaction) => {
        if (stopAfterCatch) collector.stop()

        await this.handleDecline(
          ctx,
          interaction,
          options?.embedTitle ?? 'Declined',
          options?.embedDescription ?? 'Action declined.'
        )
      }
    )
  }

  private async handleDecline<T extends CollectorInteraction>(
    ctx: CommandContext,
    interaction: T,
    title: string,
    description: string
  ) {
    const declinedEmbed = ctx.ui.embeds.error(title, {
      description,
    })
    const payload = {
      components: [],
      embeds: [declinedEmbed],
    }

    await interaction.editOrReply(payload)
  }
}

export abstract class BaseBotChatInputSubcommand extends BaseBotSubcommand {
  public abstract run(ctx: CommandContext, ...args: unknown[]): Awaitable<void>
}

export abstract class BaseBotContextMenuSubcommand extends BaseBotSubcommand {
  public abstract run(ctx: CommandContext, ...args: unknown[]): Awaitable<void>
}

export abstract class BaseBotMinigame<
  T extends Interaction,
> extends BaseBotSubcommand {
  public abstract run(interaction: T, ...args: unknown[]): Awaitable<void>
}
