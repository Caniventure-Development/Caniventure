import os from 'node:os'
import path from 'node:path'
import { env } from 'node:process'
import { ProgressBarType, UiClient } from '@discord-ui-kit/seyfert'
import { type EntityManager, MikroORM } from '@mikro-orm/postgresql'
import { CooldownManager } from '@slipher/cooldown'
import {
  Client,
  type ParseClient,
  type ParseMiddlewares,
  type UsingClient,
} from 'seyfert'
import { ShardedStatfert, type Statfert, StatfertPostable } from 'statfert'
import { Colors } from './colors.ts'
import context from './context.ts'
import { onBotPermissionsFail, onMiddlewaresError } from './handlers/index.ts'
import middlewares from './middleware/index.ts'
import { startPresence } from './presence.ts'

const client = new Client({
  context,
  commands: {
    defaults: {
      onMiddlewaresError,
      onBotPermissionsFail,
    },
  },
  gateway: {
    properties: {
      os: os.platform(),
      browser: 'Visual Studio Code',
      device: 'desktop',
    },
  },
}) as UsingClient & Client

// I hate the current user agent for Seyfert, they don't get free advertisement from me. Lmao.
client.rest.options.userAgent =
  'Vorasion (https://github.com/Vorasion-Development/Vorasion)'

client.setServices({
  middlewares,
})

client.start().then(async () => {
  const statcordApiKey = env['STATCORD_KEY']
  startPresence(client)

  if (statcordApiKey) {
    client.statfert = new ShardedStatfert(client, statcordApiKey)
    await client.statfert.start([
      StatfertPostable.CpuUsage,
      StatfertPostable.GuildCount,
      StatfertPostable.MemInformation,
      StatfertPostable.UserCount,
    ])
  } else
    client.logger.warn(
      'No Statcord API key was provided. Statfert will not be initialized.'
    )

  // @ts-expect-error - Seyfert has problems, but this is completely okay. Nothing is gonna break, hopefully... (I have no hopes...)
  client.cooldown = new CooldownManager(client)
  client.orm = await MikroORM.init()
  client.em = client.orm.em.fork()
  client.ui = new UiClient({
    colors: new Colors(),
    progressBar: {
      type: ProgressBarType.EMOJI,
    },
  })

  const baseCachePath = path.join(import.meta.dirname, '..', 'cache')
  const isDevelopment = env['NODE_ENV'] === 'development'

  await client.uploadCommands({
    cachePath: isDevelopment
      ? path.join(baseCachePath, 'commands.dev.json')
      : path.join(baseCachePath, 'commands.prod.json'),
  })
  client.logger.info('All commands uploaded')
})

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Client<true>> {
    cooldown: CooldownManager
    orm: MikroORM
    em: EntityManager
    statfert: ShardedStatfert | Statfert
    ui: UiClient
  }

  interface ExtendContext extends ReturnType<typeof context> {}

  interface RegisteredMiddlewares
    extends ParseMiddlewares<typeof middlewares> {}
}
