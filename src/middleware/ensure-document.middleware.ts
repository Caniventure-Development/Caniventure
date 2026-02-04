import { createMiddleware } from 'seyfert'

export const ensureDocumentMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const [exists, error] = await utilities.userDocuments.ensureUserExists(
      author.id
    )

    if (!exists) stop(error!)

    next()
  }
)
