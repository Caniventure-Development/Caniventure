/* eslint-disable @typescript-eslint/no-extraneous-class */
export abstract class StomachCharacter {
  public static sad(): string {
    return 'sad'
  }

  public static happy(): string {
    return 'happy'
  }

  public static hungry(): string {
    return 'hungry'
  }

  public static full(): string {
    return 'full'
  }

  public static atePlayer(): string {
    return 'atePlayer'
  }

  public static digested(): string {
    return 'digested'
  }
}
