import { Check, Entity, Index, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity'
import { User } from './user.entity'

@Entity({ tableName: 'user_balances' })
@Check({ expression: 'bones_collected >= 0', name: 'bones_collected_check' })
@Check({ expression: 'bones_in_stomach >= 0', name: 'bones_in_stomach_check' })
@Check({ expression: 'money >= 0', name: 'money_check' })
export class UserBalance extends BaseBotEntity<'bonesCollected' | 'bonesInStomach' | 'money'> {
  @OneToOne(() => User, (user) => user.balance)
  declare user: User

  @Property({ type: 'bigint', name: 'bones_collected', default: 0 })
  @Index()
  declare bonesCollected: number

  @Property({ type: 'bigint', name: 'bones_in_stomach', default: 0 })
  @Index()
  declare bonesInStomach: number

  @Property({ type: 'bigint', name: 'money', default: 0 })
  @Index()
  declare money: number
}
