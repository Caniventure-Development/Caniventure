import { createMiddleware } from 'seyfert'

export const ensureNoDocumentMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const [doesNotExist, error] =
      await utilities.userDocuments.ensureUserDoesNotExist(author.id)

    if (!doesNotExist) {
      context.utilities.helpers.removeCooldown(context, author.id)

      if (!error) {
        stop(
          'You already have a document in the database! This command is only for users who do not have a document yet!'
        )
        return
      }

      stop(error)
    }

    next()
  }
)
