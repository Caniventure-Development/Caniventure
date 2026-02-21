import { Entity, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import type { User } from './user.entity.ts'

@Entity({ tableName: 'user_states' })
export class UserStates extends BaseBotEntity<
  'isDigesting' | 'isInEndo' | 'isInPvp'
> {
  @OneToOne('User', (user: User) => user.states)
  declare user: User

  @Property({ type: 'boolean', name: 'is_digesting', default: false })
  declare isDigesting: boolean

  @Property({ type: 'boolean', name: 'is_regurgitating', default: false })
  declare isRegurgitating: boolean

  @Property({ type: 'boolean', name: 'is_in_pvp', default: false })
  declare isInPvp: boolean
}
