import type { Awaitable } from '@sapphire/utilities'

export enum StomachHandleActions {
  Squish = 'squish',
  Pat = 'pat',
  Rub = 'rub',
}

export abstract class StomachHandleActionHandler {
  public abstract handle(action: StomachHandleActions): Awaitable<string>
}
