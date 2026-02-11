import { env } from 'node:process'
import type {
  CommandContext,
  Interaction,
  ModalSubmitInteraction,
} from 'seyfert'

export function getGuildIds() {
  return env['NODE_ENV'] === 'development' && env['DEV_GUILD_ID']
    ? [env['DEV_GUILD_ID']]
    : []
}

export abstract class BaseUtility {
  public get guildIds() {
    return getGuildIds()
  }
}

export abstract class BaseUtilityWithContext extends BaseUtility {
  constructor(
    public readonly context:
      | CommandContext
      | Interaction
      | ModalSubmitInteraction
  ) {
    super()
  }

  public get ui() {
    return this.context.client.ui
  }
}
