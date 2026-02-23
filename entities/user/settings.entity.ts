import { Entity, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import type { User } from './user.entity.ts'

@Entity({ tableName: 'user_settings' })
export class UserSettings extends BaseBotEntity<
  'pvpOn' | 'permavoreModeOn' | 'allowMentions'
> {
  @OneToOne('User', (user: User) => user.settings)
  declare user: User

  @Property({ type: 'boolean', name: 'pvp_on', default: false })
  declare pvpOn: boolean

  /**
   * Whether this user can be permavored. This means if they're digested with this on,
   * their character is gone. Forever.
   */
  @Property({ type: 'boolean', name: 'permavore_mode_on', default: false })
  declare permavoreModeOn: boolean

  /**
   * Whether the bot can mention this user in the chat or not.
   */
  @Property({ type: 'boolean', name: 'allow_mentions', default: false })
  declare allowMentions: boolean
}
