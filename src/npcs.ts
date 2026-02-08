/* eslint-disable @stylistic/object-curly-newline */
enum NpcSize {
  Tiny = 'tiny',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Huge = 'huge',
}

export type CaniventureNpc = {
  size: [NpcSize, number] // Shows the name of the weight and how much capacity they take up.
  species: string
  bones: number
  money: number
}

const npcs: CaniventureNpc[] = [
  { size: [NpcSize.Tiny, 1], species: 'micro dragon', bones: 20, money: 35 },
  { size: [NpcSize.Tiny, 1], species: 'fairy', bones: 20, money: 35 },
  { size: [NpcSize.Small, 2], species: 'rabbit', bones: 15, money: 25 },
  { size: [NpcSize.Small, 1], species: 'mouse', bones: 10, money: 20 },
  { size: [NpcSize.Small, 1], species: 'squirrel', bones: 12, money: 22 },
  { size: [NpcSize.Small, 1], species: 'bird', bones: 8, money: 18 },
  { size: [NpcSize.Small, 3], species: 'raccoon', bones: 18, money: 28 },
  { size: [NpcSize.Small, 2], species: 'cat', bones: 14, money: 24 },
  { size: [NpcSize.Small, 1], species: 'ferret', bones: 11, money: 21 },
  { size: [NpcSize.Small, 1], species: 'otter', bones: 16, money: 26 },
  { size: [NpcSize.Small, 1], species: 'fox kit', bones: 13, money: 23 },
  { size: [NpcSize.Small, 2], species: 'kobold', bones: 17, money: 29 },
  { size: [NpcSize.Small, 1], species: 'imp', bones: 16, money: 30 },
  { size: [NpcSize.Small, 1], species: 'goblin', bones: 18, money: 32 },
  { size: [NpcSize.Medium, 2], species: 'fox', bones: 30, money: 45 },
  { size: [NpcSize.Medium, 3], species: 'wolf', bones: 35, money: 50 },
  { size: [NpcSize.Medium, 4], species: 'deer', bones: 40, money: 55 },
  { size: [NpcSize.Medium, 5], species: 'coyote', bones: 32, money: 48 },
  { size: [NpcSize.Medium, 4], species: 'boar', bones: 38, money: 52 },
  { size: [NpcSize.Medium, 2], species: 'lynx', bones: 33, money: 49 },
  { size: [NpcSize.Medium, 3], species: 'panther', bones: 42, money: 58 },
  { size: [NpcSize.Medium, 2], species: 'cheetah', bones: 36, money: 51 },
  {
    size: [NpcSize.Medium, 2],
    species: 'dragon (small)',
    bones: 50,
    money: 70,
  },
  { size: [NpcSize.Medium, 2], species: 'sergal', bones: 45, money: 65 },
  { size: [NpcSize.Medium, 2], species: 'protogen', bones: 42, money: 60 },
  { size: [NpcSize.Medium, 2], species: 'avali', bones: 40, money: 58 },
  { size: [NpcSize.Medium, 2], species: 'centaur', bones: 48, money: 68 },
  { size: [NpcSize.Medium, 2], species: 'werewolf', bones: 52, money: 72 },
  { size: [NpcSize.Medium, 2], species: 'naga', bones: 46, money: 66 },
  { size: [NpcSize.Large, 3], species: 'bear', bones: 75, money: 100 },
  { size: [NpcSize.Large, 3], species: 'moose', bones: 80, money: 110 },
  { size: [NpcSize.Large, 3], species: 'elk', bones: 70, money: 95 },
  { size: [NpcSize.Large, 3], species: 'buffalo', bones: 85, money: 115 },
  { size: [NpcSize.Large, 3], species: 'tiger', bones: 90, money: 120 },
  { size: [NpcSize.Large, 3], species: 'lion', bones: 88, money: 118 },
  { size: [NpcSize.Large, 3], species: 'dragon', bones: 100, money: 130 },
  { size: [NpcSize.Large, 3], species: 'gryphon', bones: 95, money: 125 },
  { size: [NpcSize.Large, 3], species: 'minotaur', bones: 88, money: 118 },
  { size: [NpcSize.Large, 3], species: 'ogre', bones: 82, money: 112 },
  {
    size: [NpcSize.Huge, 4],
    species: 'dragon (large)',
    bones: 150,
    money: 200,
  },
  { size: [NpcSize.Huge, 4], species: 'giant', bones: 140, money: 190 },
]

export default npcs
