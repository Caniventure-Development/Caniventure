import { createMiddleware } from 'seyfert'

export const ownerOnlyMiddleware = createMiddleware<void>(
  ({ context, next, stop }) => {
    if (!context.ownerId)
      stop(
        'Owner ID is not set in the .env file, this command will NOT run without it.'
      )

    const { ownerId } = context

    if (ownerId !== context.author.id) stop('You are not the owner of the bot.')

    next()
  }
)
