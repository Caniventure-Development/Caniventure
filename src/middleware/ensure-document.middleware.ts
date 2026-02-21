import { createMiddleware } from 'seyfert'

export const ensureDocumentMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const [exists, error] = await utilities.userDocuments.ensureUserExists(
      author.id
    )

    if (!exists) {
      context.utilities.helpers.removeCooldown(context, author.id)

      if (!error) {
        stop(
          'You do not have a document in the database! Please create one using `/economy start` before running this command!'
        )
        return
      }

      stop(error)
    }

    next()
  }
)
