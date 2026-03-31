import { createMiddleware } from 'seyfert'
import StomachCharacter from '#base/utilities/stomach_character.ts'

export const ensureNotFullMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context

    const user = await utilities.userDocuments.getUser(author.id, {
      populate: ['stomach'],
    })

    if (!user) {
      stop('User was not found in the database!')
      return // Useless, but helps TypeScript.
    }

    const { stomach } = user

    if (stomach.currentSize >= stomach.capacity) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop(
        `You're full, don't try eating anything at your belly size!\n\n${StomachCharacter.full()}`
      )
    }

    next()
  }
)
