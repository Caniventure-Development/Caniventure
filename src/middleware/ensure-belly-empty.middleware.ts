import { createMiddleware } from 'seyfert'

export const ensureBellyEmptyMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const user = await utilities.userDocuments.getUser(author.id)

    if (!user) {
      stop('User was not found in the database!')
      return // Useless, but helps TypeScript.
    }

    const { stomach } = user

    if (stomach.amountOfPeopleInside > 0)
      stop(
        'This command requires an empty stomach, get rid of your current prey. Then try again.'
      )

    next()
  }
)
