import colors from 'picocolors'
import { createEvent } from 'seyfert'

export default createEvent({
  data: {
    name: 'botReady',
  },
  run(user, client) {
    client.logger.info(colors.green(`${user.username} is online!`))
  },
})
