import {
  Cascade,
  Collection,
  defineEntity,
  type FindOneOptions,
  p,
} from '@mikro-orm/core'
import type { AnyContext } from 'seyfert'
import type { BaseClient } from 'seyfert/lib/client/base'
import type { PartialCharacter } from '#base/types'
import { loadCollection, nullReturner } from '#entities/utilities.ts'
import { DiscordEntity } from '../discord.entity.ts'
import { UserBalance } from './balance.entity.ts'
import { UserBio } from './bio.entity.ts'
import { UserCharacter } from './character.entity.ts'
import { UserInventoryItem } from './inventory_item.entity.ts'
import { UserSettings } from './settings.entity.ts'
import { UserStates } from './states.entity.ts'
import { UserStats } from './stats/stats.entity.ts'
import { UserStomach } from './stomach.entity.ts'

const UserSchema = defineEntity({
  name: 'User',
  extends: DiscordEntity,
  properties: {
    level: p.integer().default(1),
    experience: p.integer().default(0),
    /**
     * Whether this user has gotten close to their limit during blackjack or not.
     */
    doubleBonesActive: p.boolean().name('double_bones_active').default(false),
    hasDoneTutorial: p.boolean().name('has_done_tutorial').default(false),
    /**
     * Whether the user was swallowed whole and alive and is currently
     * in someone's gurgling gut right now. Or if they're still out and about.
     */
    isInStomach: p.boolean().name('is_in_stomach').default(false),
    /**
     * The Discord ID of the user that swallowed this user, if there is one.
     */
    captorId: p.string().name('captor_id').nullable().default(null),
    activeCharacterId: p.string().name('active_character_id'),
    balance: () => p.oneToOne(UserBalance).cascade(Cascade.ALL).owner(),
    bio: () => p.oneToOne(UserBio).cascade(Cascade.ALL).owner(),
    characters: () =>
      p.oneToMany(UserCharacter).cascade(Cascade.ALL).mappedBy('owner'),
    items: () =>
      p.oneToMany(UserInventoryItem).cascade(Cascade.ALL).mappedBy('holder'),
    settings: () => p.oneToOne(UserSettings).cascade(Cascade.ALL).owner(),
    states: () => p.oneToOne(UserStates).cascade(Cascade.ALL).owner(),
    stats: () => p.oneToOne(UserStats).cascade(Cascade.ALL).owner(),
    stomach: () => p.oneToOne(UserStomach).cascade(Cascade.ALL).owner(),
  },
  checks: [
    {
      expression: (columns) => `${columns.level} >= 1`,
      name: 'const_level_valid',
    },
    {
      expression: (columns) => `${columns.experience} >= 0`,
      name: 'const_experience_valid',
    },
  ],
  indexes: [
    { properties: ['level'] },
    { properties: ['experience'] },
    { properties: ['captorId'] },
  ],
  tableName: 'users',
})

export class User extends UserSchema.class {
  constructor(discordId: string, activeCharacter: PartialCharacter) {
    super()

    // Main State
    this.discordId = discordId

    // 1:1 Relations
    this.balance = new UserBalance()
    this.bio = new UserBio()
    this.settings = new UserSettings()
    this.states = new UserStates()
    this.stats = new UserStats()
    this.stomach = new UserStomach()

    // 1:m Relations
    this.characters = new Collection(this)
    this.items = new Collection(this)

    // Set active character
    const character = this.addCharacter(activeCharacter)
    this.activeCharacterId = character.characterId
  }

  // Extra methods and shit

  public addCharacter(partial: PartialCharacter) {
    const character = new UserCharacter(
      this,
      partial.name,
      partial.species,
      partial.role,
      partial.bio
    )

    this.characters.add(character)

    return character
  }

  /**
   * Gets the characters collections ready to use and returns it.
   * @returns The ready to use characters Collection.
   */
  public async getCharacters() {
    return loadCollection(this.characters)
  }

  /**
   * Pulls the current active character for this user.
   * If you wanted to set the active character, call `setActiveCharacter` instead.
   */
  public async getActiveCharacter() {
    const characters = await this.getCharacters()
    const character = characters.find(
      (c) => c.characterId === this.activeCharacterId
    )

    if (!character)
      throw new Error(
        'User does not have an active character, but they should!'
      )

    return character
  }

  public async setActiveCharacter(character: UserCharacter) {
    if (this.settings.permavoreModeOn)
      throw new Error(
        'You cannot change the active character of a user in permadeath mode!'
      )

    if (character.isPermad)
      throw new Error('This character is permavored, it cannot be made active!')

    const characters = await this.getCharacters()

    if (!characters.getItems().includes(character))
      throw new Error('That character is not owned by this user!')

    this.activeCharacterId = character.characterId
  }

  public async getItems() {
    return loadCollection(this.items)
  }

  /**
   * Gets the Discord user from the cache or the API.
   * @param client The Discord client, this is used to actually fetch the user.
   * @returns The Discord user or null if both attempts failed.
   */
  public async getDiscord(client: BaseClient) {
    const { users } = client
    const userFromCache = await users.fetch(this.discordId).catch(nullReturner)

    if (userFromCache) return userFromCache

    return users.fetch(this.discordId, true).catch(nullReturner)
  }

  /**
   * Gets the Discord user of the person who devoured this user and has them in their gut.
   * @param client The Discord client, this is used to actually fetch the user.
   * @returns The Discord user or null if both attempts failed, OR there's no captor.
   */
  public async getCaptor(client: BaseClient) {
    const { captorId } = this
    if (!captorId) return null

    const { users } = client
    const userFromCache = await users.fetch(captorId).catch(nullReturner)

    if (userFromCache) return userFromCache

    return users.fetch(captorId, true).catch(nullReturner)
  }

  public async getCaptorDocument(
    ctx: AnyContext,
    options?: FindOneOptions<User, ''>
  ) {
    const { captorId } = this
    if (!captorId) return null

    return ctx.utilities.userDocuments
      .getUser(captorId, options)
      .catch(nullReturner)
  }

  public setCaptor(id: string) {
    this.isInStomach = true
    this.captorId = id
  }

  public endDigestion(bonesEarned: number) {
    this.balance.bonesInStomach += bonesEarned
    this.states.isDigesting = false
    this.stomach.emptyOut()
  }

  public endRelease(moneyEarned: number) {
    this.balance.money += moneyEarned
    this.states.isRegurgitating = false
    this.stomach.emptyOut()
  }
}

UserSchema.setClass(User)
