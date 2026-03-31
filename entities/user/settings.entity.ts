import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import { User } from './user.entity.ts'

const SettingsSchema = defineEntity({
  name: 'UserSettings',
  extends: BaseBotEntity,
  properties: {
    user: () => p.oneToOne(User).mappedBy('settings'),
    pvpOn: p.boolean().name('pvp_on').default(false),
    permavoreModeOn: p.boolean().name('permavore_mode_on').default(false),
    allowMentions: p.boolean().name('allow_mentions').default(false),
  },
  tableName: 'user_settings',
})

export class UserSettings extends SettingsSchema.class {}

SettingsSchema.setClass(UserSettings)
