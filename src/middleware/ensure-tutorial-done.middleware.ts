import { createMiddleware } from 'seyfert'

export const ensureTutorialDoneMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author } = context

    const user = await context.utilities.userDocuments.getUser(author.id)

    if (!user) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop('User not found in the database!')
      return
    }

    if (!user.hasDoneTutorial) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop(
        'You have not done the tutorial yet, even if you know what to do, run `/economy tutorial` and just select the "I already know this bot" button.'
      )
    }

    next()
  }
)
