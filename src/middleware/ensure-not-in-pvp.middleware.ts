import { createMiddleware } from 'seyfert'

export const ensureNotInPvpMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const user = await utilities.userDocuments.getUser(author.id, {
      populate: ['states'],
    })

    if (!user) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop('User was not found in the database!')
      return // Useless, but helps TypeScript.
    }

    const { states } = user

    if (states.isInPvp) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop("You can't do that while you're fighting someone!") // eslint-disable-line @stylistic/quotes
    }

    next()
  }
)
