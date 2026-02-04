import {
  Check,
  Entity,
  Index,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core'
import { kebabCase } from '@luca/cases'
import { BaseBotEntity } from '../base.entity'
import type { User } from './user.entity'

@Entity({ tableName: 'user_characters' })
@Check({ expression: "character_id <> ''", name: 'id_not_empty_check' })
@Check({ expression: "name <> ''", name: 'name_not_empty_check' })
@Check({ expression: 'weight >= 0', name: 'weight_not_negative_check' })
@Unique({ properties: ['owner', 'characterId'] })
export class UserCharacter extends BaseBotEntity<'bio' | 'weight'> {
  // String used due to circular dependency if we try to do () => User, for... some odd reason.
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

  @Property({
    type: 'varchar',
    length: 256,
    name: 'bio',
    default: 'A mysterious yet intriguing character',
  })
  bio: string

  @Property({
    type: 'integer',
    name: 'weight',
    default: 300,
  })
  @Index()
  declare weight: number

  constructor(owner: User, name: string, species: string, bio?: string) {
    super()

    this.owner = owner
    this.characterId = kebabCase(name)
    this.name = name
    this.species = species
    this.bio = bio ?? this.defaultBio
  }

  private get defaultBio() {
    return 'A mysterious yet intriguing character'
  }
}
