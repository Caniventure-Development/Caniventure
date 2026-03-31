import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from './base.entity.ts'

const DiscordSchema = defineEntity({
  name: 'DiscordEntity',
  extends: BaseBotEntity,
  abstract: true,
  properties: {
    /**
     * The ID for this entity on Discord
     */
    discordId: p.string().name('discord_id').unique().check("discord_id <> ''"),
  },
  indexes: [{ properties: ['discordId'] }],
})

export abstract class DiscordEntity extends DiscordSchema.class {
  constructor(discordId: string) {
    super()

    this.discordId = discordId
  }
}

DiscordSchema.setClass(DiscordEntity)
