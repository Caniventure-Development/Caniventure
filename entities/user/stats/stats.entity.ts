import { Cascade, Entity, OneToOne } from '@mikro-orm/core'
import { BaseBotEntity } from '../../base.entity.ts'
import { User } from '../user.entity.ts'
import { UserHuntingStats } from './hunting.entity.ts'

@Entity({ tableName: 'user_stats' })
export class UserStats extends BaseBotEntity<'hunting'> {
  @OneToOne(
    () => User,
    (user) => user.stats
  )
  declare user: User

  @OneToOne(
    () => UserHuntingStats,
    (huntingStats) => huntingStats.stats,
    {
      cascade: [Cascade.ALL],
      owner: true,
    }
  )
  hunting: UserHuntingStats

  constructor() {
    super()

    this.hunting = new UserHuntingStats()
  }
}
