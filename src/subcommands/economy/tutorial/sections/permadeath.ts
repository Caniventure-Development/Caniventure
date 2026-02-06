import { stripIndents } from 'common-tags'
import { TutorialSection, type TutorialSectionContent } from '../section.ts'

export class TutorialPermadeathSection extends TutorialSection {
  public override getContent(): TutorialSectionContent {
    return {
      title: 'Permadeath Mode',
      description: stripIndents`
        So... let's say you're hardcore. You aren't scared of death, you just want something thrilling. Well... Caniventure has something for you!
        Permadeath Mode, which can be enabled in the settings. However it comes with some pros and cons, which we will touch on here.

        All right, what happens when you tell the bot to turn on permadeath mode? You're gonna get warned, mainly about a couple things:

        - 1. This mode **CANNOT** be turned off once turned on.
        - 2. Once you're digested by another pred, your entire save is wiped. For good.

        However this does come with a nice benefit, 2x the bones/money you would've normally gotten (although more benefits may come later)!

        **This mode is really no joke, only enable it if you dare to face death with dignity.**

        Anyway... that should be it for the tutorial (for now). **Click the Next button again to end the tutorial and have fun with Caniventure!**
      `,
    }
  }
}
