import { createMiddleware } from 'seyfert'

export const ownerOnlyMiddleware = createMiddleware<void>(
  ({ context, next, stop }) => {
    const { author, ownerId } = context

    if (!ownerId)
      stop(
        'Owner ID is not set in the .env file, this command will NOT run without it.'
      )

    if (ownerId !== author.id) stop('You are not the owner of the bot.')

    next()
  }
)
