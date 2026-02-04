/* eslint-disable @typescript-eslint/no-restricted-types */
import type { PartialCharacter } from '#base/types.ts'
import { User } from '#entities/user/user.entity.ts'
import { BaseUtility } from '#utilities/base.ts'
import { ResultsUtility } from '#utilities/results'

export class UserDocumentsUtility extends BaseUtility {
  public async getUser(userId: string) {
    return this.em.findOne(User, { discordId: userId })
    /*
    TODO: Rewrite this to include Redis.

    ---

    const { userRepo } = this.context.client.redis

    const cached = await userRepo.fetch(userId)

    if (!cached) {
      const user = await this.em.findOne(User, { discordId: userId })

      if (user) await this.addUserToRedis(user)

      return user
    }

    return cached as User
    */
  }

  public async createUser(userId: string, activeCharacter: PartialCharacter) {
    return this.results.fromAsync(async () => {
      const user = new User(userId, activeCharacter)

      await this.em.persist(user).flush()
      await this.addUserToRedis(user)

      return user
    })
  }

  public async ensureUserExists(
    userId: string,
    // eslint-disable-next-line @stylistic/quotes
    description = "You don't have a Caniventure profile, use the /economy start command!"
  ): Promise<[boolean, string | null]> {
    const user = await this.getUser(userId)

    if (!user) return [false, description]
    return [true, null]
  }

  public async ensureUserDoesNotExist(
    userId: string,
    // eslint-disable-next-line @stylistic/quotes
    description = "You already have a Caniventure profile, you don't need to create a new one!"
  ): Promise<[boolean, string | null]> {
    const user = await this.getUser(userId)

    if (user !== null) return [false, description]
    return [true, null]
  }

  private async addUserToRedis(user: User) {
    const { userRepo } = this.context.client.redis
    const id = user.discordId

    const cached = await userRepo.fetch(id)

    if (cached) return

    await userRepo.save(id, user)
  }

  private get em() {
    return this.context.client.orm.em.fork()
  }

  private get results() {
    return new ResultsUtility(this.context)
  }
}
