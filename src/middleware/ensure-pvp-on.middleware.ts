import { createMiddleware } from 'seyfert'

export const ensurePvpOnMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, utilities } = context
    const user = await utilities.userDocuments.getUser(author.id, {
      populate: ['settings'],
    })

    if (!user) {
      utilities.helpers.removeCooldown(context, author.id)
      stop('User was not found in the database!')
      return // Useless, but helps TypeScript.
    }

    const { settings } = user

    if (!settings.pvpOn) {
      utilities.helpers.removeCooldown(context, author.id)
      stop(
        'You do not have PvP enabled! You can enable it via `/settings toggle pvp`!'
      )
      return
    }

    next()
  }
)
