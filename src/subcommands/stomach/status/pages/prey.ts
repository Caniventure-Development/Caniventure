/* eslint-disable no-await-in-loop */
import { Result } from '@sapphire/result'
import { commaListsAnd } from 'common-tags'
import type { APIEmbedField } from 'seyfert/lib/types'
import type { CaniventureStomachStatusPage } from '../page_base'

function getNumberOfReverseEntries<T>(list: T[], amount: number) {
  return list.reverse().slice(0, amount)
}

const page: CaniventureStomachStatusPage = async (client, user, ui) => {
  const { stomach } = user

  const opponents = stomach.opponentsInside
  const users = stomach.usersInside

  const stomachIsNotEmpty = stomach.currentSize > 0
  const stomachHasOpponents = stomach.opponentsInside.length > 0
  const stomachHasUsers = stomach.usersInside.length > 0

  // Prevents mutating the actual array in the backend
  const lastThreeOpponents = getNumberOfReverseEntries([...opponents], 3)
  const lastThreeUsers = getNumberOfReverseEntries([...users], 3)

  const fields: APIEmbedField[] = []

  if (stomachHasOpponents)
    fields.push({
      name: 'Last 3 Opponents',
      value: commaListsAnd`${lastThreeOpponents}`,
      inline: true,
    })

  if (stomachHasUsers) {
    const users: string[] = []

    for (const userId of lastThreeUsers) {
      const result = await Result.fromAsync(async () =>
        client.users.fetch(userId)
      )

      if (result.isErr()) {
        users.push(userId)
        continue
      }

      const discordUser = result.unwrap()
      users.push(discordUser.username)
    }

    fields.push({
      name: 'Last 3 Users',
      value: commaListsAnd`${users}`,
      inline: true,
    })
  }

  return ui.embeds.info('Stomach Prey', {
    description: stomachIsNotEmpty ? null : 'Your stomach has no prey!',
    fields: stomachIsNotEmpty ? fields : [],
  })
}

export default page
