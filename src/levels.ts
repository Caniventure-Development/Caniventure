type CaniventureLevel = {
  number: number
  experienceRequired: number
  capacityIncrease: number
}

// You're level 1 at the start, that's why this starts at 2.
const levels: CaniventureLevel[] = [
  {
    number: 2,
    experienceRequired: 1000,
    capacityIncrease: 1,
  },
  {
    number: 3,
    experienceRequired: 2000,
    capacityIncrease: 1,
  },
  {
    number: 4,
    experienceRequired: 3000,
    capacityIncrease: 1,
  },
  {
    number: 5,
    experienceRequired: 4500,
    capacityIncrease: 2
  }
]

export default levels
