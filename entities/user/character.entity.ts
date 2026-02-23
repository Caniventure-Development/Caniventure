import { kebabCase } from '@luca/cases'
import {
  Check,
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import type { User } from './user.entity.ts'

const defaultBio = 'A mysterious yet intriguing character'

export enum UserCharacterRole {
  Pred = 'pred',
  Prey = 'prey',
  Switch = 'switch',
}

const defaultWeight = 300

@Entity({ tableName: 'user_characters' })
@Check({ expression: "character_id <> ''", name: 'id_not_empty_check' })
@Check({ expression: "name <> ''", name: 'name_not_empty_check' })
@Check({ expression: 'weight >= 0', name: 'weight_not_negative_check' })
@Unique({ properties: ['owner', 'characterId'] })
export class UserCharacter extends BaseBotEntity<
  'weight' | 'initialWeight' | 'isPermad' | 'digestedBy'
> {
  @ManyToOne('User')
  owner: User

  @Property({ type: 'string', name: 'character_id' })
  characterId: string

  @Property({ type: 'string', name: 'name' })
  name: string

  @Property({
    type: 'string',
    name: 'species',
  })
  species: string

  @Enum(() => UserCharacterRole)
  role: UserCharacterRole

  @Property({
    type: 'varchar',
    length: 256,
    name: 'bio',
    default: defaultBio,
  })
  bio: string

  /**
   * How heavy this character is in pounds.
   * Yes, I'm an American, deal with it. Lmao.
   */
  @Property({
    type: 'integer',
    name: 'weight',
    default: defaultWeight,
  })
  @Index()
  declare weight: number

  @Property({
    type: 'integer',
    name: 'initial_weight',
    default: defaultWeight,
  })
  declare initialWeight: number

  /**
   * Whether this character is permavored, AKA digested by a predator while having `settings.permavoreModeOn` set to true.
   * If this is true, the character cannot be made active.
   */
  @Property({ type: 'boolean', name: 'is_permad', default: false })
  declare isPermad: boolean

  /**
   * The Discord ID of the predator that digested this character, if any
   */
  @Property({
    type: 'string',
    name: 'digested_by',
    nullable: true,
    default: null,
  })
  declare digestedBy: string | null

  constructor(
    owner: User,
    name: string,
    species: string,
    role: UserCharacterRole,
    bio?: string
  ) {
    super()

    this.owner = owner
    this.characterId = kebabCase(name)
    this.name = name
    this.species = species
    this.bio = bio ?? defaultBio
    this.role = role
  }

  /**
   * Sets this character as permavored.
   * @param predator The predator that digested this character
   */
  public setPermavored(predator: string) {
    this.isPermad = true
    this.digestedBy = predator
    this.owner.settings.permavoreModeOn = false
  }
}
