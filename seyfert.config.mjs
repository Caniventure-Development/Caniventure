import { env } from 'node:process'
import { config } from 'seyfert'

if (!env['TOKEN']) {
  throw new Error('TOKEN is not set, make sure to set it in .env!')
}

export default config.bot({
  token: env['TOKEN'],
  intents: [
    'Guilds',
    'GuildMessages',
    'DirectMessages',
    'DirectMessageReactions',
    'GuildMessageReactions',
  ],
  locations: {
    base: './src',
    commands: 'commands',
    components: 'components',
    events: 'events',
  },
})
