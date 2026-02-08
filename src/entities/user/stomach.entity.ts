import { Check, Entity, Index, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity'
import { User } from './user.entity'

@Entity({ tableName: 'user_stomachs' })
@Check({ expression: 'capacity > 0', name: 'capacity_check' })
@Check({
  expression: 'current_size <= capacity',
  name: 'current_size_check_not_full',
})
@Check({
  expression: 'current_size >= 0',
  name: 'current_size_check_positive',
})
export class UserStomach extends BaseBotEntity<
  'capacity' | 'currentSize' | 'opponentsInside' | 'usersInside'
> {
  @OneToOne(() => User, (user) => user.stomach)
  declare user: User

  @Property({ type: 'bigint', name: 'capacity', default: 1 })
  @Index()
  declare capacity: number

  @Property({ type: 'bigint', name: 'current_size', default: 0 })
  @Index()
  declare currentSize: number

  @Property({ type: 'array', name: 'opponents_inside', default: [] })
  declare opponentsInside: string[]

  @Property({ type: 'array', name: 'users_inside', default: [] })
  declare usersInside: string[]

  @Property({ type: 'decimal', name: 'digestion_time', default: 180 })
  @Index()
  declare digestionTime: number
}
