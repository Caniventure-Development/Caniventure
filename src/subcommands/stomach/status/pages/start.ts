import type { CaniventureStomachStatusPage } from '../page_base'
import StomachCharacter from '#base/utilities/stomach_character.ts'

const page: CaniventureStomachStatusPage = (_, user, ui) => {
  const { balance, states, stomach } = user

  let status = ''

  if (states.isDigesting) status = 'Digesting'
  else if (states.isRegurgitating) status = 'Releasing'
  else if (stomach.currentSize === 0)
    status = `Empty and Hungry (${StomachCharacter.hungry()})`
  else status = 'Idle'

  return ui.embeds.info('Basic Stomach', {
    fields: [
      {
        name: 'Status',
        value: status,
        inline: false,
      },
      {
        name: 'Current Size',
        value: stomach.currentSize.toLocaleString(),
        inline: true,
      },
      {
        name: 'Capacity',
        value: stomach.capacity.toLocaleString(),
        inline: true,
      },
      {
        name: 'Bones Inside',
        value: balance.bonesInStomach.toLocaleString(),
        inline: true,
      },
    ],
  })
}

export default page
