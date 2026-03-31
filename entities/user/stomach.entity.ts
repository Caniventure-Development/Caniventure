import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import { User } from './user.entity.ts'

const StomachSchema = defineEntity({
  name: 'UserStomach',
  extends: BaseBotEntity,
  properties: {
    user: () => p.oneToOne(User).mappedBy('stomach'),
    capacity: p.bigint('number').name('capacity').default(1),
    currentSize: p.bigint('number').name('current_size').default(0),
    opponentsInside: p.array().name('opponents_inside').default<string[]>([]),
    usersInside: p.array().name('users_inside').default<string[]>([]),
    digestionTime: p.decimal('number').name('digestion_time').default(180),
  },
  checks: [
    {
      expression: (columns) => `${columns.capacity} > 0`,
      name: 'const_capacity_non_zero',
    },
    {
      expression: (columns) => `${columns.currentSize} <= ${columns.capacity}`,
      name: 'const_current_size_not_full',
    },
    {
      expression: (columns) => `${columns.currentSize} >= 0`,
      name: 'const_current_size_positive',
    },
  ],
  indexes: [
    { properties: ['capacity'] },
    { properties: ['currentSize'] },
    { properties: ['digestionTime'] },
  ],
  tableName: 'user_stomachs',
})

export class UserStomach extends StomachSchema.class {
  public addOpponent(name: string, size: number) {
    this.currentSize += size
    this.opponentsInside.push(name)
  }

  public addUser(id: string) {
    this.currentSize += 1
    this.usersInside.push(id)
  }

  public emptyOut() {
    this.currentSize = 0
    this.opponentsInside = []
    this.usersInside = []
  }
}

StomachSchema.setClass(UserStomach)
