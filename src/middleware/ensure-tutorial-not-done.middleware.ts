import { createMiddleware } from 'seyfert'

export const ensureTutorialNotDoneMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author } = context

    const user = await context.utilities.userDocuments.getUser(author.id)

    if (!user) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop('User not found in the database!')
      return
    }

    if (user.hasDoneTutorial) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop("You have already done the tutorial, you don't need to do it again!") // eslint-disable-line @stylistic/quotes
    }

    next()
  }
)
