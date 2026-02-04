import { createMiddleware } from 'seyfert'

export const ensureTutorialDoneMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const user = await context.utilities.userDocuments.getUser(
      context.author.id
    )

    if (!user) {
      stop('User not found in the database!')
      return
    }

    if (!user.hasDoneTutorial)
      stop(
        'You have not done the tutorial yet, even if you know what to do, run `/economy tutorial` and just select the "I already know this bot" button.'
      )

    next()
  }
)
