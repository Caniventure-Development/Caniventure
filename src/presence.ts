import { Time } from '@sapphire/timestamp'
import type { Client } from 'seyfert'
import {
  ActivityType,
  PresenceUpdateStatus,
  type GatewayActivityUpdateData,
} from 'seyfert/lib/types'

const presences: GatewayActivityUpdateData[] = [
  {
    name: 'the predators',
    type: ActivityType.Watching,
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

  setInterval(() => {
    setRandomPresence(client)
  }, Time.Minute * 5)
}
