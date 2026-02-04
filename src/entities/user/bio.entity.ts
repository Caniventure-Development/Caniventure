import { Entity, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity'
import { User } from './user.entity'

@Entity({ tableName: 'user_bios' })
export class UserBio extends BaseBotEntity<'content'> {
  @OneToOne(() => User, (user) => user.bio)
  declare user: User

  @Property({ type: 'varchar', length: 80, default: 'A mysterious predator' })
  declare content: string
}
