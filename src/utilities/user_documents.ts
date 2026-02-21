import type {
  FindOneOptions,
  FindOneOrFailOptions,
} from '@mikro-orm/postgresql'
import type { PartialCharacter } from '#base/types.ts'
import { User } from '#entities/user/user.entity.ts'
import { BaseUtilityWithContext } from '#utilities/base.ts'
import { ResultsUtility } from '#utilities/results'

export class UserDocumentsUtility extends BaseUtilityWithContext {
  public async getUser(userId: string, options?: FindOneOptions<User, ''>) {
    return this.em.findOne(User, { discordId: userId }, options)
  }

  public async forceGetUser(
    userId: string,
    options?: Omit<FindOneOrFailOptions<User, ''>, 'strict'>
  ) {
    let baseOptions = { strict: true }

    if (options) baseOptions = { ...baseOptions, ...options }

    return this.em.findOneOrFail(
      User,
      { discordId: userId },
      { ...baseOptions }
    )
  }

  public async createUser(userId: string, activeCharacter: PartialCharacter) {
    return this.results.fromAsync(async () => {
      const user = new User(userId, activeCharacter)

      await this.em.persist(user).flush()

      return user
    })
  }

  public async ensureUserExists(
    userId: string,
    description = "You don't have a Caniventure profile, use the /economy start command!"
  ): Promise<[boolean, string | null]> {
    const user = await this.getUser(userId)

    if (!user) return [false, description]
    return [true, null]
  }

  public async ensureUserDoesNotExist(
    userId: string,
    description = "You already have a Caniventure profile, you don't need to create a new one!"
  ): Promise<[boolean, string | null]> {
    const user = await this.getUser(userId)

    if (user !== null) return [false, description]
    return [true, null]
  }

  private get em() {
    return this.context.client.em
  }

  private get results() {
    return new ResultsUtility()
  }
}
