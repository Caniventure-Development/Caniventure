import { titleCase } from '@luca/cases'
import { type CommandContext, StringSelectOption } from 'seyfert'
import { TextInputStyle } from 'seyfert/lib/types/index'
import { CONSTANTS } from '#base/constants.ts'
import { UserCharacterRole } from '#entities/user/character.entity.ts'
import { BaseUtility } from './base.ts'
import { RandomUtility } from './random.ts'

type PlaceholderCharacter = {
  name: string
  bio: string
}

const roleDescriptions: Map<UserCharacterRole, string> = new Map([
  [
    UserCharacterRole.Pred,
    'A very hungry character, looking for squirming prey',
  ],
  [
    UserCharacterRole.Prey,
    'A character that can just be a snack for a pred, or find a home inside one',
  ],
  [UserCharacterRole.Switch, 'A combination of Pred and Prey'],
])

// Some characters I made up, useful as a placeholder. :)
const placeholderCharacters: PlaceholderCharacter[] = [
  {
    name: 'Dumara',
    bio: 'A soft, sweet, fluffy dragon with a big heart and an even bigger stomach.',
  },
  {
    name: 'Zephyr',
    bio: "An energetic dragon that doesn't hold back from anything, not even danger.",
  },
  {
    name: 'Cexical',
    bio: 'An absolute tyrant of a pred, but surprisingly sweet when given enough love and affection.',
  },
  {
    name: 'Lunara',
    bio: "Dumara's sister, traumatized by him devouring their father and barely goes prey hunting.",
  },
]

export class ModalsUtility extends BaseUtility {
  public characterCreationModal(
    ctx: CommandContext,
    textDisplay?: string,
    isStartCommand = true
  ) {
    const characterCreationModalConstants = CONSTANTS['CHARACTER_CREATION']
    const modalId = characterCreationModalConstants['MODAL_ID']
    const speciesOptions = CONSTANTS['SPECIES_OPTIONS']
    const { selectMenuPlaceholder } = this
    const randomPlaceholderCharacter = this.randomPlaceholderCharacter

    return this.modals(ctx)
      .create(
        isStartCommand ? modalId : `${modalId}-new`,
        'Vorasion Character Creation'
      )
      .withTextDisplay(
        textDisplay ??
          "Welcome to Vorasion, creating a character is very important to distinguish yourself from the small, simple minded humans! Let's create one!"
      )
      .withTextInput(characterCreationModalConstants['NAME_FIELD_ID'], {
        label: 'Character Name',
        placeholder: randomPlaceholderCharacter.name,
        description:
          'Give us a name for your character! Must not be more than 50 characters in length.',
        style: TextInputStyle.Short,
        max: 50,
        required: true,
      })
      .withStringSelect(characterCreationModalConstants['SPECIES_FIELD_ID'], {
        label: 'Character Species',
        description: 'What species is your character?',
        values: speciesOptions
          .sort((a, b) => a.name.localeCompare(b.name)) // Alphabetical order
          .map((species) =>
            new StringSelectOption().setLabel(species.name).setValue(species.id)
          ),
        placeholder: selectMenuPlaceholder,
        min: 1,
        max: 1,
        required: true,
      })
      .withStringSelect(characterCreationModalConstants['ROLE_FIELD_ID'], {
        label: 'Character Role',
        description: 'What role is your character?',
        values: Object.values(UserCharacterRole).map((role) => {
          const option = new StringSelectOption()
            .setLabel(titleCase(role))
            .setValue(role)
          const description = roleDescriptions.get(role)

          if (description) option.setDescription(description)

          return option
        }),
        placeholder: selectMenuPlaceholder,
        min: 1,
        max: 1,
        required: true,
      })
      .withTextInput(characterCreationModalConstants['BIO_FIELD_ID'], {
        label: 'Character Bio',
        description:
          'A simple bio of your character. Must be between 0 to 1000 characters.',
        placeholder: randomPlaceholderCharacter.bio,
        style: TextInputStyle.Paragraph,
        max: 1_000,
        required: false,
      })
      .build()
  }

  public characterCreationLookInformationModal(
    ctx: CommandContext,
    isStartCommand = true
  ) {
    const characterCreationLookModalConstants =
      CONSTANTS['CHARACTER_INFORMATION']
    const modalId = characterCreationLookModalConstants['MODAL_ID']

    return this.modals(ctx)
      .create(
        isStartCommand ? modalId : `${modalId}-new`,
        'Vorasion Character Creation - Information'
      )
      .withTextDisplay(
        "Now you'll have to enter some extra information about how your character looks"
      )
      .withTextInput(
        characterCreationLookModalConstants['HEIGHT_FIELD_ID'],
        this.characterCreationModalLookInformationOptions('height')
      )
      .withStringSelect(
        `${characterCreationLookModalConstants['UNIT_PREFERENCE_FIELD_ID']}-height`,
        this.characterCreationModalLookInformationUnitOptions('height')
      )
      .withTextInput(
        characterCreationLookModalConstants['WEIGHT_FIELD_ID'],
        this.characterCreationModalLookInformationOptions('weight')
      )
      .withStringSelect(
        `${characterCreationLookModalConstants['UNIT_PREFERENCE_FIELD_ID']}-weight`,
        this.characterCreationModalLookInformationUnitOptions('weight')
      )
      .build()
  }

  private characterCreationModalLookInformationOptions(name: string) {
    return {
      label: `Character ${titleCase(name)}`,
      description: `Enter the ${name.toLowerCase()} of your character, without any units. Numbers only, please.`,
      style: TextInputStyle.Short,
      placeholder: '800',
      required: true,
    }
  }

  private characterCreationModalLookInformationUnitOptions(name: string) {
    return {
      label: `Character ${titleCase(name)} Unit`,
      description: `What measurement unit is the ${name.toLowerCase()} in?`,
      values: Object.values(this.units).map((unit) =>
        new StringSelectOption().setLabel(titleCase(unit)).setValue(unit)
      ),
      placeholder: this.selectMenuPlaceholder,
      min: 1,
      max: 1,
      required: true,
    }
  }

  private modals(ctx: CommandContext) {
    return ctx.ui.modals
  }

  private get randomPlaceholderCharacter() {
    return this.random.item(placeholderCharacters)
  }

  private get random() {
    return new RandomUtility()
  }

  private get selectMenuPlaceholder() {
    return 'Select one from here...'
  }

  private get units() {
    return CONSTANTS['UNITS']
  }
}
