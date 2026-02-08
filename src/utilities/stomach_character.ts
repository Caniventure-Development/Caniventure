/* eslint-disable @typescript-eslint/no-extraneous-class */
import { RandomUtility } from './random.ts'

export default abstract class StomachCharacter {
  public static sad(): string {
    const sadSounds = [
      '*grrrrowwwwl...*',
      '*grumble... grumble...*',
      '*sad gurgle...*',
      '*disappointed rumble...*',
      '*quiet groan...*',
      '*mournful growl...*',
    ]

    return this.random.item(sadSounds)
  }

  public static happy(): string {
    const happySounds = [
      '*GLORRRRP~!*',
      '*happy gurgle gurgle!*',
      '*content GLORP!*',
      '*satisfied rumble~*',
      '*pleased grumble!*',
      '*joyful GLORRRP!*',
      '*cheerful gurgle!*',
    ]

    return this.random.item(happySounds)
  }

  public static hungry(): string {
    const hungrySounds = [
      '*GRRRROWWWL!*',
      '*grumble grumble grumble*',
      '*hungry growl...*',
      '*demanding rumble!*',
      '*impatient gurgle!*',
      '*loud GRUMBLE!*',
      '*insistent growl...*',
    ]

    return this.random.item(hungrySounds)
  }

  public static full(): string {
    const fullSounds = [
      '*satisfied gurgle~*',
      '*content glorp...*',
      '*peaceful rumble...*',
      '*happy churn~*',
      '*pleased grumble...*',
      '*sleepy gurgle...*',
      '*warm rumble~*',
    ]

    return this.random.item(fullSounds)
  }

  public static atePlayer(): string {
    const atePlayerSounds = [
      '*GLORRRP!* Someone new inside!',
      '*BIG GULP!* Player added!',
      '*GLORP GLORP!* Welcome to the party!',
      '*massive gurgle!* Another one!',
      '*LOUD GLORRRRP~!* Got them!',
      '*victorious rumble!* Caught!',
    ]

    return this.random.item(atePlayerSounds)
  }

  public static digesting(): string {
    const digestingSounds = [
      '*glorrrp... gurgle... glorp...*',
      '*churn... rumble... churn...*',
      '*working gurgle... glorp...*',
      '*active rumble... glorrrp...*',
      '*busy gurgle gurgle...*',
      '*processing... glorp... chuuurrrnn...*',
      '*steady rumble... gurgle...*',
    ]

    return this.random.item(digestingSounds)
  }

  public static digested(): string {
    const digestedSounds = [
      '*final satisfied gurgle~*',
      '*content GLORP* Job done!',
      '*peaceful rumble...* All finished~',
      '*relaxed gurgle~*',
      '*calm grumble...* Complete!',
      '*satisfied churn~* Done!',
    ]

    return this.random.item(digestedSounds)
  }

  private static readonly random = new RandomUtility()
}
