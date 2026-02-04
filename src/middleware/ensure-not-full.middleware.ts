import { createMiddleware } from 'seyfert'

export const ensureNotFullMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const user = await utilities.userDocuments.getUser(author.id)

    if (!user) {
      stop('User was not found in the database!')
      return // Useless, but helps TypeScript.
    }

    const { stomach } = user

    if (stomach.amountOfPeopleInside >= stomach.capacity)
      stop("You're full, don't try eating anything at your belly size!") // eslint-disable-line @stylistic/quotes

    next()
  }
)
