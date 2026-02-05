import { Entity, Index, Property } from '@mikro-orm/core'
import { DiscordEntity } from '../discord.entity'

@Entity({ tableName: 'blacklisted_ids' })
export class BlacklistEntry extends DiscordEntity<'reason'> {
  @Property({ type: 'string', name: 'moderator_id' })
  @Index()
  declare moderatorId: string

  @Property({
    type: 'text',
    name: 'reason',
    nullable: true,
    default: null,
  })
  declare reason: string | undefined
}
