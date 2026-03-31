import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '#entities/base.entity.ts'
import { UserStats } from './stats.entity.ts'

const HuntingStatsSchema = defineEntity({
  name: 'UserHuntingStats',
  extends: BaseBotEntity,
  properties: {
    stats: () => p.oneToOne(UserStats).mappedBy('hunting'),
    huntsDone: p.integer().name('hunts_done').default(0),
    huntsWon: p.integer().name('hunts_won').default(0),
  },
  checks: [
    {
      expression: (columns) => `${columns.huntsDone} >= 0`,
      name: 'const_hunts_done_non_negative',
    },
    {
      expression: (columns) => `${columns.huntsWon} >= 0`,
      name: 'const_hunts_won_non_negative',
    },
  ],
  indexes: [{ properties: ['huntsDone'] }, { properties: ['huntsWon'] }],
  tableName: 'user_hunting_stats',
})

export class UserHuntingStats extends HuntingStatsSchema.class {}

HuntingStatsSchema.setClass(UserHuntingStats)
