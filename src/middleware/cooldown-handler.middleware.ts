import { createMiddleware, Formatter } from 'seyfert'
import { TimestampStyle } from 'seyfert/lib/common'
import { COOLDOWN_MESSAGES } from '#base/cooldown_messages.constant.ts'

export const cooldownMiddleware = createMiddleware<void>(
  async ({ context, next, stop }) => {
    const inCooldown = context.client.cooldown.context(context)

    if (typeof inCooldown === 'number') {
      const timestamp = Formatter.timestamp(
        new Date(Date.now() + inCooldown),
        TimestampStyle.RelativeTime
      )
      const commandName = (context.fullCommandName as string).split(' ').at(-1)

      if (!commandName) {
        stop(`That command is still on a cooldown. Try again ${timestamp}.`)
        return
      }

      const baseMessage = `You're on a cooldown for ${commandName}, try again ${timestamp}.`

      const cooldownMessage = COOLDOWN_MESSAGES[commandName]

      stop(
        cooldownMessage
          ? cooldownMessage.replace('{timestamp}', timestamp)
          : baseMessage
      )
      return
    }

    next()
  }
)
