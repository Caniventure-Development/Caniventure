import { stripIndents } from 'common-tags'
import { TutorialSection, type TutorialSectionContent } from '../section.ts'

export class TutorialIntroSection extends TutorialSection {
  public override getContent(): TutorialSectionContent {
    return {
      title: 'Caniventure Tutorial',
      description: stripIndents`Welcome to Caniventure **{author}**! Or, as your current character is known... **{character}**!
            This whole command is meant to get you all set up to learn what this bot is about before you go all out on everything.
            Keep in mind this bot is still in development, and things are still subject to change.

            If you're sure you can do this alone (or if you've already run through this), you can click the secondary Exit button. Otherwise, click the Primary button.
            `,
    }
  }
}
