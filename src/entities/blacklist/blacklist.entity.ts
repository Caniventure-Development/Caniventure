import { Entity, Index, Property } from '@mikro-orm/core'
import { Schema } from 'redis-om'
import { DiscordEntity, discordSchema } from '../discord.entity'

@Entity({ tableName: 'blacklisted_ids' })
export class BlacklistEntry extends DiscordEntity<'reason'> {
  @Property({ type: 'text', name: 'moderator_id' })
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

export const blacklistSchema = new Schema('blacklist', {
  ...discordSchema,
  moderatorId: { type: 'string', indexed: true },
  reason: { type: 'string' },
})
