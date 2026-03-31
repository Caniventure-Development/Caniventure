import { defineEntity, p } from '@mikro-orm/core'
import { ShopItem } from '#entities/shop_item/item.entity.ts'
import { BaseBotEntity } from '../base.entity.ts'
import { User } from './user.entity.ts'

const InventoryItemSchema = defineEntity({
  name: 'UserInventoryItem',
  extends: BaseBotEntity,
  properties: {
    holder: () => p.manyToOne(User),
    item: p.oneToOne(ShopItem).ref(),
    quantity: p.bigint('number').name('quantity').default(0),
  },
  tableName: 'user_inventory_items',
})

export class UserInventoryItem extends InventoryItemSchema.class {}

InventoryItemSchema.setClass(UserInventoryItem)
