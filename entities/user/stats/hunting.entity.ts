import { Check, Entity, Index, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../../base.entity.ts'
import { UserStats } from './stats.entity.ts'

@Entity({ tableName: 'user_hunting_stats' })
@Check({ expression: 'hunts_done >= 0 AND hunts_won >= 0' })
export class UserHuntingStats extends BaseBotEntity<'huntsDone' | 'huntsWon'> {
  @OneToOne(
    () => UserStats,
    (stats) => stats.hunting
  )
  declare stats: UserStats

  @Property({ type: 'integer', name: 'hunts_done', default: 0 })
  @Index()
  declare huntsDone: number

  @Property({ type: 'integer', name: 'hunts_won', default: 0 })
  @Index()
  declare huntsWon: number
}
