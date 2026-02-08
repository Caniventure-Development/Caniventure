import { createMiddleware } from 'seyfert'

export const ensureBonesInStomachMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const user = await utilities.userDocuments.getUser(author.id, {
      populate: ['balance'],
    })

    if (!user) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop('User was not found in the database!')
      return // Useless, but helps TypeScript.
    }

    const { balance } = user

    if (balance.bonesInStomach <= 0) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop("You don't have any bones in your stomach!") // eslint-disable-line @stylistic/quotes
    }

    next()
  }
)
