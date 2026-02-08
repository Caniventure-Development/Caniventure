import { BaseUtility } from './base.ts'

export class RandomUtility extends BaseUtility {
  /**
   * Returns a random item from an array of `typeparam` T
   * @param items The items to pick a random item from
   */
  public item<T>(items: readonly T[]): T {
    if (items.length === 0)
      throw new Error('Cannot get a random item out of an empty array!')

    return items[Math.floor(Math.random() * items.length)]!
  }

  /**
   * Returns a number between 0 and max exclusively
   * @param max The maximum number (exclusive)
   */
  public next(max: number): number

  /**
   * Returns a number between min (inclusive) and max (exclusive)
   * @param min The minimum number (inclusive)
   * @param max The maximum number (exclusive)
   */
  public next(min: number, max: number): number

  public next(minOrMax: number, max?: number): number {
    let min: number
    let maxValue: number

    if (max === undefined) {
      min = 0
      maxValue = minOrMax
    } else {
      min = minOrMax
      maxValue = max
    }

    if (min > maxValue) [min, maxValue] = [maxValue, min]

    return Math.floor(Math.random() * (maxValue - min) + min)
  }

  public nextFloat(max: number): number

  public nextFloat(min: number, max: number): number

  public nextFloat(minOrMax: number, max?: number): number {
    let min: number
    let maxValue: number

    if (max === undefined) {
      min = 0
      maxValue = minOrMax
    } else {
      min = minOrMax
      maxValue = max
    }

    if (min > maxValue) [min, maxValue] = [maxValue, min]

    return Math.random() * (maxValue - min) + min
  }

  public catchAttemptSuccess(npcSize: number, userLevel: number) {
    const baseChance = 0.7
    const sizePenalty = (npcSize - 1) * 0.1 // -10% per space taken
    const levelBonus = userLevel * 0.01 // +1% per level

    const calculated = baseChance - sizePenalty + levelBonus
    const chance = Math.min(0.95, Math.max(0.3, calculated))

    return Math.random() <= chance
  }
}
