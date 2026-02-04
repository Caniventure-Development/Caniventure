import {
  BaseEntity,
  Entity,
  Index,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Schema } from 'redis-om'

@Entity({ abstract: true })
export abstract class BaseBotEntity<Optional = never> extends BaseEntity {
  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt' | Optional

  @PrimaryKey({ autoincrement: true })
  declare id: number

  /**
   * When this entity was created
   */
  @Property({
    type: 'datetime',
    name: 'created_at',
    onCreate: () => new Date(),
  })
  @Index()
  createdAt: Date = new Date()

  /**
   * When this entity was last updated
   */
  @Property({
    type: 'datetime',
    name: 'updated_at',
    onUpdate: () => new Date(),
  })
  @Index()
  updatedAt: Date = new Date()
}

export const baseSchema = new Schema('base', {
  id: { type: 'number', indexed: true },
  createdAt: { type: 'date', indexed: true },
  updatedAt: { type: 'date', indexed: true },
})
