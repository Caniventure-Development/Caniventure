import { Check, Entity, Property } from '@mikro-orm/core'
import { Schema } from 'redis-om'
import { BaseBotEntity, baseSchema } from './base.entity'

@Entity({ abstract: true })
@Check({ expression: "discord_id <> ''" })
export abstract class DiscordEntity<
  Optional = never,
> extends BaseBotEntity<Optional> {
  /**
   * The ID of the entity on Discord
   */
  @Property({ type: 'string', name: 'discord_id', unique: true })
  discordId: string

  constructor(discordId: string) {
    super()

    this.discordId = discordId
  }
}

export const discordSchema = new Schema('discord', {
  ...baseSchema,
  discordId: { type: 'string', indexed: true },
})
