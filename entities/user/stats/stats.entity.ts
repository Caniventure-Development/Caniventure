import { Cascade, defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '#entities/base.entity.ts'
import { User } from '../user.entity.ts'
import { UserHuntingStats } from './hunting.entity.ts'
import { UserStomachStats } from './stomach.entity.ts'

const StatsSchema = defineEntity({
  name: 'UserStats',
  extends: BaseBotEntity,
  properties: {
    user: () => p.oneToOne(User).mappedBy('stats'),
    hunting: () => p.oneToOne(UserHuntingStats).owner().cascade(Cascade.ALL),
    stomach: () => p.oneToOne(UserStomachStats).owner().cascade(Cascade.ALL),
  },
  tableName: 'user_stats',
})

export class UserStats extends StatsSchema.class {
  constructor() {
    super()

    this.hunting = new UserHuntingStats()
    this.stomach = new UserStomachStats()
  }
}

StatsSchema.setClass(UserStats)
