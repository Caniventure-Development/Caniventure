import { createMiddleware } from 'seyfert'

export const ensureNoDocumentMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const [doesNotExist, error] =
      await utilities.userDocuments.ensureUserDoesNotExist(author.id)

    if (!doesNotExist) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop(error!)
    }

    next()
  }
)
