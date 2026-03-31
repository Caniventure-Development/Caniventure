type VorasionSpecies = {
  id: string
  name: string
}

type VorasionConstants = {
  COLLECTOR_TIMED_OUT: 'timeout'
  OPEN_MODAL_ID: 'open-modal'
  CHARACTER_CREATION: {
    MODAL_ID: string
    NAME_FIELD_ID: string
    BIO_FIELD_ID: string
    ROLE_FIELD_ID: string
    SPECIES_FIELD_ID: string
  }
  CHARACTER_INFORMATION: {
    MODAL_ID: string
    HEIGHT_FIELD_ID: string
    WEIGHT_FIELD_ID: string
    UNIT_PREFERENCE_FIELD_ID: string
  }
  UNITS: {
    METRIC: string
    IMPERIAL: string
  }
  SPECIES_OPTIONS: VorasionSpecies[]
}

export const CONSTANTS: Readonly<VorasionConstants> = Object.freeze({
  COLLECTOR_TIMED_OUT: 'timeout',
  OPEN_MODAL_ID: 'open-modal',
  CHARACTER_CREATION: {
    MODAL_ID: 'character-creation-modal',
    NAME_FIELD_ID: 'character-name',
    BIO_FIELD_ID: 'character-bio',
    ROLE_FIELD_ID: 'character-role',
    SPECIES_FIELD_ID: 'character-species',
  },
  CHARACTER_INFORMATION: {
    MODAL_ID: 'character-information-modal',
    HEIGHT_FIELD_ID: 'character-height',
    WEIGHT_FIELD_ID: 'character-weight',
    UNIT_PREFERENCE_FIELD_ID: 'character-unit-preference',
  },
  UNITS: {
    METRIC: 'metric',
    IMPERIAL: 'imperial',
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
      id: 'dog',
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
    {
      id: 'protogen',
      name: 'Protogen',
    },
    {
      id: 'hybrid',
      name: 'Hybrid',
    },
    {
      id: 'reptile',
      name: 'Reptile',
    },
    {
      id: 'human',
      name: 'Human',
    },
    {
      id: 'mechanical',
      name: 'Mech',
    },
  ],
})

export const startCollectorId = (authorId: string) => `${authorId}-start`
export const createCollectorId = (authorId: string) => `${authorId}-create`
