import { createMiddleware } from 'seyfert'

export const ensureNotDigestingMiddleware = createMiddleware<void>(
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

    if (states.isDigesting) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop(
        'Your stomach is literally full of acids, hold off on that command for a moment!'
      )
    }

    next()
  }
)
