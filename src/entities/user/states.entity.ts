import { Entity, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity'
import { User } from './user.entity'

@Entity({ tableName: 'user_states' })
export class UserStates extends BaseBotEntity<
  'isDigesting' | 'isInEndo' | 'isInPvp'
> {
  @OneToOne(() => User, (user) => user.states)
  declare user: User

  @Property({ type: 'boolean', name: 'is_digesting', default: false })
  declare isDigesting: boolean

  @Property({ type: 'boolean', name: 'is_in_endo', default: false })
  declare isInEndo: boolean

  @Property({ type: 'boolean', name: 'is_in_pvp', default: false })
  declare isInPvp: boolean
}
