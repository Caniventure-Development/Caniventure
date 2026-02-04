import { Check, Entity, Index, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity'
import { User } from './user.entity'

@Entity({ tableName: 'user_stomachs' })
@Check({ expression: 'capacity > 0', name: 'capacity_check' })
@Check({
  expression: 'amount_of_people_inside <= capacity',
  name: 'amount_of_people_inside_check_not_full',
})
@Check({
  expression: 'amount_of_people_inside >= 0',
  name: 'amount_of_people_inside_check_positive',
})
export class UserStomach extends BaseBotEntity<
  'capacity' | 'amountOfPeopleInside' | 'opponentsInside' | 'usersInside'
> {
  @OneToOne(() => User, (user) => user.stomach)
  declare user: User

  @Property({ type: 'bigint', name: 'capacity', default: 1 })
  declare capacity: number

  @Property({ type: 'bigint', name: 'amount_of_people_inside', default: 0 })
  @Index()
  declare amountOfPeopleInside: number

  @Property({ type: 'array', name: 'opponents_inside', default: [] })
  declare opponentsInside: string[]

  @Property({ type: 'array', name: 'users_inside', default: [] })
  declare usersInside: string[]

  @Property({ type: 'decimal', name: 'digestion_time', default: 180 })
  @Index()
  declare digestionTime: number
}
