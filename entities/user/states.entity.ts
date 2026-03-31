import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import { User } from './user.entity.ts'

const StatesSchema = defineEntity({
  name: 'UserStates',
  extends: BaseBotEntity,
  properties: {
    user: () => p.oneToOne(User).mappedBy('states'),
    isDigesting: p.boolean().name('is_digesting').default(false),
    isRegurgitating: p.boolean().name('is_regurgitating').default(false),
    isInPvp: p.boolean().name('is_in_pvp').default(false),
  },
  tableName: 'user_states',
})

export class UserStates extends StatesSchema.class {}

StatesSchema.setClass(UserStates)
