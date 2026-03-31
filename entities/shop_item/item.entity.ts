import { Cascade, defineEntity, p, wrap } from '@mikro-orm/core'
import type { EntityManager } from '@mikro-orm/postgresql'
import { BaseBotEntity } from '#entities/base.entity.ts'
import type { UserBalance } from '#entities/user/balance.entity.ts'
import type { User } from '#entities/user/user.entity.ts'
import { entityIsInitialized } from '#entities/utilities.ts'
import { ItemCostType, ShopItemCost } from './cost.entity.ts'

type PurchaseResult = {
  success: boolean
  error?: string
}

const ItemSchema = defineEntity({
  name: 'ShopItem',
  extends: BaseBotEntity,
  properties: {
    itemId: p.string().name('item_id'),
    name: p.string().name('name'),
    description: p.string().name('description'),
    cost: () => p.oneToOne(ShopItemCost).cascade(Cascade.ALL).owner(),
  },
  checks: [
    {
      expression: (columns) => `${columns.itemId} <> ''`,
      name: 'const_item_id_not_empty',
    },
    {
      expression: (columns) => `${columns.name} <> ''`,
      name: 'const_name_not_empty',
    },
    {
      expression: (columns) => `${columns.description} <> ''`,
      name: 'const_description_not_empty',
    },
  ],
  tableName: 'shop_items',
})

export class ShopItem extends ItemSchema.class {
  constructor(name: string, description: string, cost: ShopItemCost) {
    super()

    this.name = name
    this.description = description
    this.cost = cost
  }

  public async buy(
    user: User,
    emToFork: EntityManager
  ): Promise<PurchaseResult> {
    const em = emToFork.fork()
    em.persist(user)

    if (!entityIsInitialized(user.balance))
      await wrap(user).populate(['balance'])

    const { balance } = user
    const { cost } = this
    const balanceAmount = this.getBalance(balance)

    if (balanceAmount < cost.amount)
      return {
        success: false,
        error: `You don't have enough **${cost.type}** to purchase **${this.name}**! You have **${balanceAmount}** but need **${cost.amount}** **${cost.type}**!`,
      }

    // const items = await user.getItems()

    this.deductBalance(balance)

    await em.flush()

    return {
      success: true,
    }
  }

  private getBalance(balance: UserBalance) {
    const { cost } = this

    switch (cost.type) {
      case ItemCostType.Bones:
        return balance.bonesCollected
      case ItemCostType.Money:
        return balance.money
      default:
        throw new Error(
          `The cost type ${cost.type} is not yet handled by the buy method!`
        )
    }
  }

  private deductBalance(balance: UserBalance) {
    const { cost } = this

    switch (cost.type) {
      case ItemCostType.Bones:
        balance.bonesCollected -= cost.amount
        break
      case ItemCostType.Money:
        balance.money -= cost.amount
        break
      default:
        throw new Error(
          `The cost type ${cost.type} is not yet handled by the buy method!`
        )
    }
  }
}

ItemSchema.setClass(ShopItem)
