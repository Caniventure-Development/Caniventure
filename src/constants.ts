type CaniventureSpecies = {
  id: string
  name: string
}

type CaniventureConstants = {
  COLLECTOR_TIMED_OUT: 'time'
  COOLDOWN_HIT: 'subcommandPreconditionCooldown'
  DOCUMENT_NOT_FOUND_WHEN_EXPECTED: 'DocumentNotFoundWhenExpected'
  DOCUMENT_FOUND_WHEN_NONE_EXPECTED: 'DocumentFoundWhenNotExpected'
  CHARACTER_CREATION: {
    MODAL_ID: string
    NAME_FIELD_ID: string
    BIO_FIELD_ID: string
    SPECIES_FIELD_ID: string
  }
  SPECIES_OPTIONS: CaniventureSpecies[]
}

export const CONSTANTS: Readonly<CaniventureConstants> = Object.freeze({
  COLLECTOR_TIMED_OUT: 'time',
  COOLDOWN_HIT: 'subcommandPreconditionCooldown',
  DOCUMENT_NOT_FOUND_WHEN_EXPECTED: 'DocumentNotFoundWhenExpected',
  DOCUMENT_FOUND_WHEN_NONE_EXPECTED: 'DocumentFoundWhenNotExpected',
  CHARACTER_CREATION: {
    MODAL_ID: 'character-creation-modal',
    NAME_FIELD_ID: 'character-name',
    BIO_FIELD_ID: 'character-bio',
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
