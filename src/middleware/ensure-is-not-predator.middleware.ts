import { createMiddleware } from 'seyfert'
import { UserCharacterRole } from '#entities/user/character.entity.ts'

export const ensureCharacterIsNotPredatorMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const { author } = context

    const user = await context.utilities.userDocuments.getUser(author.id)

    if (!user) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop('User not found in the database!')
      return
    }

    const activeCharacter = await user.getActiveCharacter()

    if (activeCharacter.role === UserCharacterRole.Pred) {
      context.utilities.helpers.removeCooldown(context, author.id)
      stop(
        `Your active character ${activeCharacter.name} is a predator, they cannot use this command!`
      )
    }

    next()
  }
)
