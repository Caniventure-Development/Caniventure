import {
  Cascade,
  Check,
  Collection,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core'
import { DiscordEntity } from '../discord.entity'
import { UserBalance } from './balance.entity'
import { UserBio } from './bio.entity'
import { UserCharacter } from './character.entity'
import { UserSettings } from './settings.entity'
import { UserStates } from './states.entity'
import { UserStomach } from './stomach.entity'
import type { PartialCharacter } from '#base/types.ts'

@Entity({ tableName: 'users' })
export class User extends DiscordEntity<
  | 'activeCharacterId'
  | 'doubleBonesActive'
  | 'hasDoneTutorial'
  | 'level'
  | 'experience'
  | 'isBlacklisted'
  | 'isInStomach'
  | 'captorId'
  | 'balance'
  | 'bio'
  | 'settings'
  | 'states'
  | 'stomach'
> {
  /**
   * The level of this user
   */
  @Property({ type: 'integer', default: 1 })
  @Check({ expression: 'level >= 1' })
  @Index()
  declare level: number

  /**
   * How much experience this user has
   */
  @Property({
    type: 'bigint',
    default: 0,
  })
  @Check({ expression: 'experience >= 0' })
  @Index()
  declare experience: number

  /**
   * Whether this user has gotten close to their limit during blackjack or not.
   */
  @Property({ type: 'boolean', name: 'double_bones_active', default: false })
  declare doubleBonesActive: boolean

  /**
   * Whether the user has finished the tutorial or not.
   */
  @Property({ type: 'boolean', name: 'has_done_tutorial', default: false })
  declare hasDoneTutorial: boolean

  /**
   * Whether the user is blacklisted from using the bot or not.
   */
  @Property({ type: 'boolean', name: 'is_blacklisted', default: false })
  declare isBlacklisted: boolean

  /**
   * Whether the user was swallowed whole and alive and is currently
   * in a gurgling prison right now. Or if they're still out and about.
   */
  @Property({ type: 'boolean', name: 'is_in_stomach', default: false })
  declare isInStomach: boolean

  /**
   * The Discord ID of the user that swallowed this user, if there is one.
   */
  @Property({
    type: 'string',
    name: 'captor_id',
    nullable: true,
    default: null,
  })
  @Index()
  declare captorId: string | null

  @Property({
    type: 'string',
    name: 'active_character_id',
  })
  /**
   * The characterId of the active character for this user. You shouldn't need to use this.
   * Use `getActiveCharacter` instead.
   */
  protected activeCharacterId: string

  @OneToOne(() => UserBalance, (balance) => balance.user, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  balance: UserBalance

  @OneToOne(() => UserBio, (bio) => bio.user, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  bio: UserBio

  @OneToMany(() => UserCharacter, (character) => character.owner, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  protected internalCharacters = new Collection<UserCharacter>(this)

  @OneToOne(() => UserSettings, (settings) => settings.user, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  settings: UserSettings

  @OneToOne(() => UserStates, (states) => states.user, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  states: UserStates

  @OneToOne(() => UserStomach, (stomach) => stomach.user, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  stomach: UserStomach

  constructor(discordId: string, characterToCreate: PartialCharacter) {
    super(discordId)

    const character = new UserCharacter(
      this,
      characterToCreate.name,
      characterToCreate.species,
      characterToCreate.bio
    )

    this.internalCharacters.add(character)

    this.activeCharacterId = character.characterId
    this.balance = new UserBalance()
    this.bio = new UserBio()
    this.settings = new UserSettings()
    this.states = new UserStates()
    this.stomach = new UserStomach()
  }

  // Extra methods and shit

  /**
   * Gets the characters collections ready to use and returns it.
   * @returns The ready to use characters Collection.
   */
  public async getCharacters() {
    return this.internalCharacters.isInitialized()
      ? this.internalCharacters.load()
      : this.internalCharacters.init()
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
    const characters = await this.getCharacters()

    if (!characters.getItems().includes(character))
      throw new Error('That character is not owned by this user!')

    this.activeCharacterId = character.characterId
  }
}
