import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '../../base.entity.ts'
import { UserStats } from './stats.entity.ts'

const StomachStatsSchema = defineEntity({
  name: 'UserStomachStats',
  extends: BaseBotEntity,
  properties: {
    stats: () => p.oneToOne(UserStats).mappedBy('stomach'),
    preyCaptured: p.integer().name('prey_captured').default(0),
    preyDigested: p.integer().name('prey_digested').default(0),
  },
  checks: [
    {
      expression: (columns) => `${columns.preyCaptured} >= 0`,
      name: 'const_prey_captured_non_negative',
    },
    {
      expression: (columns) => `${columns.preyDigested} >= 0`,
      name: 'const_prey_digested_non_negative',
    },
  ],
  indexes: [{ properties: ['preyCaptured'] }, { properties: ['preyDigested'] }],
  tableName: 'user_stomach_stats',
})

export class UserStomachStats extends StomachStatsSchema.class {}

StomachStatsSchema.setClass(UserStomachStats)
