import { createMiddleware } from 'seyfert'

export const ensureTutorialNotDoneMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const user = await context.utilities.userDocuments.getUser(
      context.author.id
    )

    if (!user) {
      stop('User not found in the database!')
      return
    }

    if (user.hasDoneTutorial)
      stop("You have already done the tutorial, you don't need to do it again!") // eslint-disable-line @stylistic/quotes

    next()
  }
)
