import { defineEntity, p } from '@mikro-orm/core'
import { DiscordEntity } from '../discord.entity.ts'

const BlacklistSchema = defineEntity({
  name: 'BlacklistEntry',
  extends: DiscordEntity,
  properties: {
    moderatorId: p.string().name('moderator_id'),
    reason: p.string().name('reason').nullable().default(null),
  },
  indexes: [{ properties: 'moderatorId' }],
  tableName: 'blacklisted_ids',
})

export class BlacklistEntry extends BlacklistSchema.class {
  constructor(
    discordId: string,
    moderatorId: string,
    reason: string | null = null
  ) {
    super()

    this.discordId = discordId
    this.moderatorId = moderatorId
    this.reason = reason
  }
}

BlacklistSchema.setClass(BlacklistEntry)
