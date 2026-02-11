import type { UiClient } from '@discord-ui-kit/seyfert'
import type { Awaitable } from '@sapphire/utilities'
import type { Embed } from 'seyfert'
import type { BaseClient } from 'seyfert/lib/client/base'
import type { User } from '#entities/user/user.entity.ts'

export type CaniventureStomachStatusPage = (
  client: BaseClient,
  user: User,
  ui: UiClient
) => Awaitable<Embed>
