type CaniventureLevel = {
  number: number
  experienceRequired: number
  capacityIncrease: number
}

// You're level 1 at the start, that's why this starts at 2.
const levels: CaniventureLevel[] = [
  {
    number: 2,
    experienceRequired: 500,
    capacityIncrease: 5,
  },
]

export default levels
