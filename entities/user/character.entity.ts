import { kebabCase } from '@luca/cases'
import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import { User } from './user.entity.ts'

export enum UserCharacterRole {
  Pred = 'pred',
  Prey = 'prey',
  Switch = 'switch',
}

export enum UserCharacterMeasurementSystem {
  Imperial = 'imperial',
  Metric = 'metric',
}

const defaultBio = 'A mysterious yet intriguing character'
const defaultHeight = 12
const defaultWeight = 300

const CharacterSchema = defineEntity({
  name: 'UserCharacter',
  extends: BaseBotEntity,
  properties: {
    owner: () => p.manyToOne(User),
    characterId: p.string().name('character_id'),
    name: p.string().name('name'),
    species: p.string().name('species'),
    role: p.enum(() => UserCharacterRole).nativeEnumName('character_role'),
    bio: p.string().length(1_000).name('bio').default(defaultBio),
    height: p.integer().name('height').default(defaultHeight),
    initialHeight: p.integer().name('initial_height').default(defaultHeight),
    weight: p.integer().name('weight').default(defaultWeight),
    initialWeight: p.integer().name('initial_weight').default(defaultWeight),
    isPermad: p.boolean().name('is_permad').default(false),
    digestedBy: p.string().name('digested_by').nullable().default(null),
  },
  tableName: 'user_characters',
  checks: [
    {
      expression: (columns) => `${columns.characterId} <> ''`,
      name: 'const_id_not_empty',
    },
    {
      expression: (columns) => `${columns.name} <> ''`,
      name: 'const_name_not_empty',
    },
    {
      expression: (columns) => `${columns.weight} >= 0`,
      name: 'const_weight_non_negative',
    },
  ],
  uniques: [{ properties: ['owner', 'characterId'] }],
})

export class UserCharacter extends CharacterSchema.class {
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

CharacterSchema.setClass(UserCharacter)
