import type { CommandContext, Interaction } from 'seyfert'
import { CooldownType } from '@slipher/cooldown'
import type {
  CollectorInteraction,
  CreateComponentCollectorResult,
} from 'seyfert/lib/components/handler'

type EnsureAgreedOptions = {
  agreeCustomId?: string
  disagreeCustomId?: string
  embedTitle?: string
  embedDescription?: string
  stopAfterCatch?: boolean
}

abstract class BaseBotSubcommand {
  readonly #commandName: string

  constructor(commandName: string) {
    this.#commandName = commandName
  }

  public removeCooldown(
    ctx: CommandContext,
    id: string,
    cooldownType: CooldownType = CooldownType.User
  ) {
    if (
      !ctx.client.cooldown.has({
        name: this.#commandName,
        target: id,
      })
    )
      return

    ctx.client.cooldown.resource.remove(
      `${this.#commandName}:${cooldownType}:${id}`
    )
  }

  public async notImplemented<T extends Interaction>(
    ctx: CommandContext,
    context: T
  ) {
    await ctx.utilities.helpers.handleNotImplemented(context)
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
  public abstract run(ctx: CommandContext, ...args: unknown[]): Promise<void>
}

export abstract class BaseBotContextMenuSubcommand extends BaseBotSubcommand {
  public abstract run(ctx: CommandContext, ...args: unknown[]): Promise<void>
}

export abstract class BaseBotMinigame<
  T extends Interaction,
> extends BaseBotSubcommand {
  public abstract run(interaction: T, ...args: unknown[]): Promise<void>
}
