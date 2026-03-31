import { defineEntity, p, raw } from '@mikro-orm/core'

const BaseSchema = defineEntity({
  name: 'BaseBotEntity',
  abstract: true,
  properties: {
    id: p.integer().primary().autoincrement(),
    /**
     * When this entity was created
     */
    createdAt: p
      .datetime()
      .name('created_at')
      .onCreate(() => new Date())
      .default(raw('now()')),
    /**
     * When this entity was last updated
     */
    updatedAt: p
      .datetime()
      .name('updated_at')
      .onUpdate(() => new Date())
      .default(raw('now()')),
  },
  indexes: [{ properties: ['createdAt'] }, { properties: ['updatedAt'] }],
})

export abstract class BaseBotEntity extends BaseSchema.class {}

BaseSchema.setClass(BaseBotEntity)
