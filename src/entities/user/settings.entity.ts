import { Entity, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity'
import { User } from './user.entity'

@Entity({ tableName: 'user_settings' })
export class UserSettings extends BaseBotEntity<
  'pvpOn' | 'colorblindModeOn' | 'permadeathModeOn' | 'allowMentions'
> {
  @OneToOne(() => User, (user) => user.settings)
  declare user: User

  @Property({ type: 'boolean', name: 'pvp_on', default: false })
  declare pvpOn: boolean

  @Property({ type: 'boolean', name: 'colorblind_mode_on', default: false })
  declare colorblindModeOn: boolean

  @Property({ type: 'boolean', name: 'permadeath_mode_on', default: false })
  declare permadeathModeOn: boolean

  @Property({ type: 'boolean', name: 'allow_mentions', default: false })
  declare allowMentions: boolean
}
