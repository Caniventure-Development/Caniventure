import { Entity, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import type { User } from './user.entity.ts'

@Entity({ tableName: 'user_settings' })
export class UserSettings extends BaseBotEntity<
  'pvpOn' | 'permadeathModeOn' | 'allowMentions'
> {
  @OneToOne('User', (user: User) => user.settings)
  declare user: User

  @Property({ type: 'boolean', name: 'pvp_on', default: false })
  declare pvpOn: boolean

  @Property({ type: 'boolean', name: 'permadeath_mode_on', default: false })
  declare permadeathModeOn: boolean

  @Property({ type: 'boolean', name: 'allow_mentions', default: false })
  declare allowMentions: boolean
}
