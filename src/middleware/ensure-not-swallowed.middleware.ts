import { createMiddleware } from 'seyfert'

export const ensureNotSwallowedMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, client, utilities } = context

    const user = await utilities.userDocuments.getUser(author.id)

    if (!user) {
      stop('User was not found in the database!')
      return // Useless, but helps TypeScript.
    }

    const { captorId, isInStomach } = user

    if (isInStomach) {
      context.utilities.helpers.removeCooldown(context, author.id)

      if (!captorId) {
        stop("You've become a meal for someone! You can't run this command!") // eslint-disable-line @stylistic/quotes
        return
      }

      let user = await client.users.fetch(captorId)

      function getMessageWithUser() {
        return `You were swallowed by ${user.username}, this command won't work while you're inside their gurgling prison!`
      }

      if (!user) {
        const forceHttpRequest = true
        user = await client.users.fetch(captorId, forceHttpRequest)
      }

      stop(getMessageWithUser())
    }

    next()
  }
)
