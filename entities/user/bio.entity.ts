import { Entity, OneToOne, Property } from '@mikro-orm/core'
import { BaseBotEntity } from '../base.entity.ts'
import { User } from './user.entity.ts'

@Entity({ tableName: 'user_bios' })
export class UserBio extends BaseBotEntity<'content'> {
  @OneToOne(
    () => User,
    (user) => user.bio
  )
  declare user: User

  @Property({ type: 'varchar', length: 80, default: 'A mysterious predator' })
  declare content: string
}
