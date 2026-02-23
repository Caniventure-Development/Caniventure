type VorasionSpecies = {
  id: string
  name: string
}

type VorasionConstants = {
  COLLECTOR_TIMED_OUT: 'timeout'
  CHARACTER_CREATION: {
    MODAL_ID: string
    NAME_FIELD_ID: string
    BIO_FIELD_ID: string
    ROLE_FIELD_ID: string
    SPECIES_FIELD_ID: string
  }
  SPECIES_OPTIONS: VorasionSpecies[]
}

export const CONSTANTS: Readonly<VorasionConstants> = Object.freeze({
  COLLECTOR_TIMED_OUT: 'timeout',
  CHARACTER_CREATION: {
    MODAL_ID: 'character-creation-modal',
    NAME_FIELD_ID: 'character-name',
    BIO_FIELD_ID: 'character-bio',
    ROLE_FIELD_ID: 'character-role',
    SPECIES_FIELD_ID: 'character-species',
  },
  SPECIES_OPTIONS: [
    {
      id: 'dragon',
      name: 'Dragon',
    },
    {
      id: 'wolf',
      name: 'Wolf',
    },
    {
      id: 'bird',
      name: 'Bird',
    },
    {
      id: 'dinosaur',
      name: 'Dinosaur',
    },
    {
      id: 'snake',
      name: 'Snake',
    },
    {
      id: 'fox',
      name: 'Fox',
    },
    {
      id: 'Dog',
      name: 'Dog',
    },
    {
      id: 'cat',
      name: 'Cat',
    },
    {
      id: 'jaguar',
      name: 'Jaguar',
    },
    {
      id: 'tiger',
      name: 'Tiger',
    },
  ],
})
