import { createEvent } from 'seyfert'
import colors from 'picocolors'

export default createEvent({
  data: {
    name: 'botReady',
  },
  run(user, client) {
    client.logger.info(colors.green(`${user.username} is online!`))
  },
})
