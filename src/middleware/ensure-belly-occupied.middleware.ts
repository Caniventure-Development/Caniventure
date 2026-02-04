import { createMiddleware } from 'seyfert'

export const ensureBellyOccupiedMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const user = await utilities.userDocuments.getUser(author.id)

    if (!user) {
      stop('User was not found in the database!')
      return // Useless, but helps TypeScript.
    }

    const { stomach } = user

    if (stomach.amountOfPeopleInside === 0)
      stop('Your belly is empty, try eating something (_or someone... ;)_)')

    next()
  }
)
