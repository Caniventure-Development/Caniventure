import path from 'node:path'
import { env } from 'node:process'
import {
  Client,
  type ParseClient,
  type ParseMiddlewares,
  type UsingClient,
} from 'seyfert'
import { CooldownManager } from '@slipher/cooldown'
import { MikroORM } from '@mikro-orm/postgresql'
import { UiClient, ProgressBarType } from '@discord-ui-kit/seyfert'
import { MessageFlags } from 'seyfert/lib/types/index'
import { Repository } from 'redis-om'
import { createClient } from 'redis'
import context from './context.ts'
import { Colors } from './colors.ts'
import middlewares from './middleware/index.ts'
import { blacklistSchema, userSchema } from '#entities/schemas.ts'

const client = new Client({
  context,
  commands: {
    defaults: {
      async onMiddlewaresError(context, error) {
        await context.editOrReply({
          content: error,
          flags: MessageFlags.Ephemeral,
        })
      },
    },
  },
}) as UsingClient & Client

client.setServices({
  middlewares,
})

client.start().then(async () => {
  const redis = createClient({
    url: env['REDIS_URL'],
  })

  redis.on('error', (error) => {
    client.logger.error(`Redis Client Error: ${error}`)
  })

  await redis.connect()

  client.cooldown = new CooldownManager(client)
  client.orm = await MikroORM.init()
  client.redis = {
    blacklistRepo: new Repository(blacklistSchema, redis),
    userRepo: new Repository(userSchema, redis),
  }
  client.ui = new UiClient({
    colors: new Colors(),
    progressBar: {
      type: ProgressBarType.EMOJI,
    },
  })

  await client.uploadCommands({
    cachePath: path.join(import.meta.dirname, '..', 'cache', 'commands.json'),
  })
  client.logger.info('All commands uploaded')
})

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Client<true>> {
    cooldown: CooldownManager
    orm: MikroORM
    redis: {
      blacklistRepo: Repository
      userRepo: Repository
    }
    ui: UiClient
  }

  interface ExtendContext extends ReturnType<typeof context> {}
  interface RegisteredMiddlewares extends ParseMiddlewares<
    typeof middlewares
  > {}
}
