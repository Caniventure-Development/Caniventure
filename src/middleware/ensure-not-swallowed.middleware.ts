import { createMiddleware } from 'seyfert'

export const ensureNotSwallowedMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author, client, utilities } = context

    const user = await utilities.userDocuments.getUser(author.id)

    if (!user) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop('User was not found in the database!')
      return // Useless, but helps TypeScript.
    }

    const { captorId, isInStomach } = user

    if (isInStomach) {
      context.utilities.helpers.removeCooldown(context, author.id)
      const baseMessage =
        "You've become a meal for someone! You can't run this command!"

      if (!captorId) {
        stop(baseMessage)
        return
      }

      const captor = await user.getCaptor(client)

      if (!captor) {
        stop(baseMessage)
        return
      }

      const captorDocument = await user.getCaptorDocument(context)
      const baseMessageWithUsername = `You were swallowed by **${captor.username}**, this command won't work while you're inside their gurgling gut!`

      if (!captorDocument) {
        stop(baseMessageWithUsername)
        return
      }

      const captorActiveCharacter = await captorDocument.getActiveCharacter()

      stop(
        `You were swallowed by **${captorActiveCharacter.name}** (${captor.username}), this command won't work while you're inside their gurgling gut!`
      )
    }

    next()
  }
)
