import type {
  CommandContext,
  Interaction,
  ModalSubmitInteraction,
} from 'seyfert'

export abstract class BaseUtility {
  constructor(
    public readonly context:
      | CommandContext
      | Interaction
      | ModalSubmitInteraction
  ) {}

  public get ui() {
    return this.context.client.ui
  }
}

