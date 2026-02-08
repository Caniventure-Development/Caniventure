import { env } from 'node:process'
import { extendContext } from 'seyfert'
import { UiClient } from '@discord-ui-kit/seyfert'
import {
  CollectorsUtility,
  HelpersUtility,
  RandomUtility,
  ResultsUtility,
  UserDocumentsUtility,
} from './utilities/index.ts'
import { Colors } from './colors.ts'

type ExtendedContext = Record<string, any> & {
  utilities: Utilities
  ui: UiClient
  ownerId?: string
}

type Utilities = {
  collectors: CollectorsUtility
  helpers: HelpersUtility
  random: RandomUtility
  results: ResultsUtility
  userDocuments: UserDocumentsUtility
}

export default extendContext(
  (interaction): ExtendedContext => ({
    utilities: {
      collectors: new CollectorsUtility(interaction),
      helpers: new HelpersUtility(interaction),
      random: new RandomUtility(),
      results: new ResultsUtility(),
      userDocuments: new UserDocumentsUtility(interaction),
    },
    ui: new UiClient({
      colors: new Colors(),
    }),
    ownerId: env['DISCORD_OWNER_ID'],
  })
)
