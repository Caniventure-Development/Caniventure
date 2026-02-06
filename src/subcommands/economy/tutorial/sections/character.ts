import { stripIndents } from 'common-tags'
import { TutorialSection, type TutorialSectionContent } from '../section.ts'

export class TutorialCharacterSection extends TutorialSection {
  public override getContent(): TutorialSectionContent {
    return {
      title: 'Your Character',
      description: stripIndents`
        Your character is basically a separate version of yourself, some way to be someone else during your usage of this bot.
        **You created one when you joined Caniventure, and you can always
        manage your characters by using the \`/character\` set of commands _(coming soon)_.**

        You named your first character **{character}** who is a **{species}**. Which is very intriguing,
        you also described your character as "{bio}".

        **Next, you'll learn about the main "weapon" of sorts in this bot.**
      `,
    }
  }
}
