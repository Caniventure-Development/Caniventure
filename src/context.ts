import { env } from 'node:process'
import { UiClient } from '@discord-ui-kit/seyfert'
import { extendContext } from 'seyfert'
import uiOptions from './ui_options.ts'
import {
  CollectorsUtility,
  HelpersUtility,
  ModalsUtility,
  RandomUtility,
  ResultsUtility,
  UserDocumentsUtility,
} from './utilities/index.ts'

type ExtendedContext = Record<string, unknown> & {
  utilities: Utilities
  ui: UiClient
  ownerId?: string
}

type Utilities = {
  collectors: CollectorsUtility
  helpers: HelpersUtility
  modals: ModalsUtility
  random: RandomUtility
  results: ResultsUtility
  userDocuments: UserDocumentsUtility
}

export default extendContext(
  (interaction): ExtendedContext => ({
    utilities: {
      collectors: new CollectorsUtility(interaction),
      helpers: new HelpersUtility(interaction),
      modals: new ModalsUtility(),
      random: new RandomUtility(),
      results: new ResultsUtility(),
      userDocuments: new UserDocumentsUtility(interaction.client),
    },
    ui: new UiClient(uiOptions),
    ownerId: env['DISCORD_OWNER_ID'],
  })
)
