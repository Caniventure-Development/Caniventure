import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { User } from '#entities/user/user.entity.ts'
import {
  logError,
  logInfo,
  logSuccess,
  logWarn,
} from '#utilities/seeder_logger.ts'
import { ResultsUtility } from '../utilities'

const readyForMigration = (user: User) =>
  logInfo(`${user.discordId} ready for migration!`)
const { fromAsync } = new ResultsUtility()

export class MigratorSeeder extends Seeder {
  async run(emToFork: EntityManager) {
    const em = emToFork.fork()
    const currentDataResult = await fromAsync(
      em.findAll(User, { populate: ['*'] })
    )

    if (currentDataResult.isErr()) {
      logError(
        'Failed to get the current data in the database!',
        currentDataResult.unwrapErr()
      )
      return
    }

    const currentData = currentDataResult.unwrap()

    if (currentData.length === 0) {
      logWarn('There is no data to migrate! Exiting...')
      return
    }

    for (const user of currentData) {
      const activeCharacter = await user.getActiveCharacter()
      const otherCharacters = (await user.getCharacters()).filter(
        (char) => char.characterId !== activeCharacter.characterId
      )

      const created = new User(user.discordId, activeCharacter)

      if (otherCharacters.length === 0) {
        em.remove(user).persist(created)
        readyForMigration(user)
        continue
      }

      const createdCharacters = await created.getCharacters()

      for (const character of otherCharacters) createdCharacters.add(character)

      em.remove(user).persist(created)
      readyForMigration(user)
    }

    logInfo('All users gone through, attempting to flush to DB...')
    const flushingResult = await fromAsync(em.flush())

    if (flushingResult.isErr()) {
      logError('Failed to flush!', flushingResult.unwrapErr())
      return
    }

    logSuccess(`All ${currentData.length} users are on the new schema!`)
  }
}
