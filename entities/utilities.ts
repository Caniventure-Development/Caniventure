import { type Collection, wrap } from '@mikro-orm/core'

export async function loadCollection<
  E extends object,
  O extends object = object,
>(collection: Collection<E, O>, isFullyInitialized = false) {
  return collection.isInitialized(isFullyInitialized)
    ? collection.load()
    : collection.init()
}

export function entityIsInitialized<T extends object>(entity: T) {
  return wrap(entity).isInitialized()
}

export const nullReturner = () => null
