import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import { User } from './user.entity.ts'

const BalanceSchema = defineEntity({
  name: 'UserBalance',
  extends: BaseBotEntity,
  properties: {
    user: () => p.oneToOne(User).mappedBy('balance'),
    bonesCollected: p.bigint('number').name('bones_collected').default(0),
    bonesInStomach: p.bigint('number').name('bones_in_stomach').default(0),
    money: p.bigint('number').name('money').default(0),
  },
  tableName: 'user_balances',
  checks: [
    {
      expression: (columns) => `${columns.bonesCollected} >= 0`,
      name: 'const_bones_collected_non_negative',
    },
    {
      expression: (columns) => `${columns.bonesInStomach} >= 0`,
      name: 'const_bones_in_stomach_non_negative',
    },
    {
      expression: (columns) => `${columns.money} >= 0`,
      name: 'const_money_non_negative',
    },
  ],
  indexes: [
    { name: 'indx_bones_collected', properties: ['bonesCollected'] },
    { name: 'indx_bones_in_stomach', properties: ['bonesInStomach'] },
    { name: 'indx_money', properties: ['money'] },
  ],
})

export class UserBalance extends BalanceSchema.class {}

BalanceSchema.setClass(UserBalance)
