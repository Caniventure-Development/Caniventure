import { defineEntity, p } from '@mikro-orm/core'
import { BaseBotEntity } from '#entities/base.entity.ts'
import { ShopItem } from './item.entity'

export enum ItemCostType {
  Bones = 'bones',
  Money = 'money',
}

const ItemCostSchema = defineEntity({
  name: 'ShopItemCost',
  extends: BaseBotEntity,
  properties: {
    item: () => p.oneToOne(ShopItem).mappedBy('cost'),
    type: p
      .enum(() => ItemCostType)
      .name('type')
      .nativeEnumName('cost_type'),
    amount: p.bigint('number').name('amount'),
  },
  checks: [
    {
      expression: (columns) => `${columns.amount} > 0`,
      name: 'const_amount_not_zero',
    },
  ],
  indexes: [{ properties: ['amount'] }],
  tableName: 'shop_item_costs',
})

export class ShopItemCost extends ItemCostSchema.class {
  constructor(type: ItemCostType, amount: number) {
    super()

    this.type = type
    this.amount = amount
  }
}

ItemCostSchema.setClass(ShopItemCost)
