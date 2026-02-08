import os from 'node:os'
import path from 'node:path'
import { UiClient, ProgressBarType } from '@discord-ui-kit/seyfert'
import { type EntityManager, MikroORM } from '@mikro-orm/postgresql'
import { CooldownManager } from '@slipher/cooldown'
import {
  Client,
  type ParseClient,
  type ParseMiddlewares,
  type UsingClient,
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types/index'
import { CHECK_FAILED_EMBED_TITLES } from './check_failed_embed_titles.constant.ts'
import context from './context.ts'
import { Colors } from './colors.ts'
import middlewares from './middleware/index.ts'
import { startPresence } from './presence.ts'

const client = new Client({
  context,
  commands: {
    defaults: {
      async onMiddlewaresError(context, error) {
        const { ui, utilities } = context
        const { random } = utilities

        const failureEmbed = ui.embeds.error(
          random.item(CHECK_FAILED_EMBED_TITLES),
          {
            description: error,
          }
        )

        await context.editOrReply({
          embeds: [failureEmbed],
          flags: MessageFlags.Ephemeral,
        })
      },
    },
  },
  gateway: {
    properties: {
      os: os.platform(),
      browser: 'Seyfert Bot',
      device: 'desktop',
    },
  },
}) as UsingClient & Client

client.setServices({
  middlewares,
})

client.start().then(async () => {
  startPresence(client)

  client.cooldown = new CooldownManager(client)
  client.orm = await MikroORM.init()
  client.em = client.orm.em.fork()
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
    em: EntityManager
    ui: UiClient
  }

  interface ExtendContext extends ReturnType<typeof context> {}
  interface RegisteredMiddlewares extends ParseMiddlewares<
    typeof middlewares
  > {}
}
