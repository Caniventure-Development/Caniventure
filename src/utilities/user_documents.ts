import type {
  FindOneOptions,
  FindOneOrFailOptions,
} from '@mikro-orm/postgresql'
import type { UsingClient } from 'seyfert'
import type { PartialCharacter } from '#base/types.ts'
import { User } from '#entities/user/user.entity.ts'
import { BaseUtility } from '#utilities/base.ts'
import { ResultsUtility } from '#utilities/results'

type ExistenceResult = [boolean, string | null]

export class UserDocumentsUtility extends BaseUtility {
  private client: UsingClient

  constructor(client: UsingClient) {
    super()

    this.client = client
  }

  public async getUser(userId: string, options?: FindOneOptions<User, ''>) {
    return this.em.findOne(User, { discordId: userId }, options)
  }

  public async forceGetUser(
    userId: string,
    options?: Omit<FindOneOrFailOptions<User, ''>, 'strict'>
  ) {
    let baseOptions: FindOneOrFailOptions<User, ''> = { strict: true }

    if (options) baseOptions = { ...baseOptions, ...options }

    return this.em.findOneOrFail(
      User,
      { discordId: userId },
      { ...baseOptions }
    )
  }

  public async createUser(userId: string, activeCharacter: PartialCharacter) {
    return this.results.fromAsync(async () => {
      const em = this.em.fork()
      const user = new User(userId, activeCharacter)

      await em.persist(user).flush()
      return user
    })
  }

  public async ensureUserExists(
    userId: string,
    description = "You don't have a Vorasion profile, use the /economy start command!"
  ): Promise<ExistenceResult> {
    const user = await this.getUser(userId)

    if (!user) return [false, description]
    return [true, null]
  }

  public async ensureUserDoesNotExist(
    userId: string,
    description = "You already have a Vorasion profile, you don't need to create a new one!"
  ): Promise<ExistenceResult> {
    const user = await this.getUser(userId)

    if (user !== null) return [false, description]
    return [true, null]
  }

  private get em() {
    return this.client.em
  }

  private get results() {
    return new ResultsUtility()
  }
}
