import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import { User } from './user.entity.ts'

const userBioSchema = defineEntity({
  name: 'UserBio',
  extends: BaseBotEntity,
  properties: {
    user: () => p.oneToOne(User).mappedBy('bio'),
    content: p.string().length(80).default('A mysterious predator'),
  },
  tableName: 'user_bios',
})

export class UserBio extends userBioSchema.class {}

userBioSchema.setClass(UserBio)
