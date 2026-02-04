import { Result, type ResultResolvable } from '@sapphire/result'
import type { Awaitable } from '@sapphire/utilities'
import { BaseUtility } from './base.ts'

export class ResultsUtility extends BaseUtility {
  public from<T, E = Error>(
    fn: ResultResolvable<T> | (() => ResultResolvable<T>)
  ): Result<T, E> {
    return Result.from<T, E>(fn)
  }

  public async fromAsync<T, E = Error>(
    fn: Awaitable<ResultResolvable<T>> | (() => Awaitable<ResultResolvable<T>>)
  ): Promise<Result<T, E>> {
    return Result.fromAsync<T, E>(fn)
  }
}
