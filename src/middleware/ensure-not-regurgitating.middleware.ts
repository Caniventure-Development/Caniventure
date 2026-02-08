import { createMiddleware } from 'seyfert'

export const ensureNotRegurgitatingMiddleware = createMiddleware<void>(
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

    if (states.isRegurgitating) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop(
        "This command requires that you aren't trying to get prey out of your stomach actively, wait for a moment!" // eslint-disable-line @stylistic/quotes
      )
    }

    next()
  }
)
