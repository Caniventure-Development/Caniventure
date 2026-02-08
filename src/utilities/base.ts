/* eslint-disable @typescript-eslint/no-extraneous-class */
import type {
  CommandContext,
  Interaction,
  ModalSubmitInteraction,
} from 'seyfert'

export abstract class BaseUtility {}

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
