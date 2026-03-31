import { Time } from '@sapphire/timestamp'
import type { Client } from 'seyfert'
import {
  ActivityType,
  type GatewayActivityUpdateData,
  PresenceUpdateStatus,
} from 'seyfert/lib/types'

const presences: GatewayActivityUpdateData[] = [
  {
    name: 'the predators',
    type: ActivityType.Watching,
  },
  {
    name: 'everyone',
    type: ActivityType.Watching,
  },
  {
    name: 'with a great hunger',
    type: ActivityType.Watching,
  },
  {
    name: 'with my prey',
    type: ActivityType.Playing,
  },
]

const setRandomPresence = (client: Client) => {
  const presence = presences[Math.floor(Math.random() * presences.length)]

  if (!presence) return

  client.gateway.setPresence({
    activities: [presence],
    status: PresenceUpdateStatus.Online,
    since: Date.now(),
    afk: false,
  })
}

export const startPresence = (client: Client) => {
  setRandomPresence(client)

  setInterval(() => setRandomPresence(client), Time.Minute * 5)
}
