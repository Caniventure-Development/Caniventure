import { stripIndents } from 'common-tags'
import { TutorialSection, type TutorialSectionContent } from '../section.ts'

export class TutorialHuntingSection extends TutorialSection {
  public override getContent(): TutorialSectionContent {
    return {
      title: 'Hunting',
      description: stripIndents`
        This is a big part of the bot,, so you might want to pay attention.
      `,
    }
  }
}
