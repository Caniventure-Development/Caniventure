import { stripIndents } from 'common-tags'
import { TutorialSection, type TutorialSectionContent } from '../section.ts'

export class TutorialPreySection extends TutorialSection {
  public override getContent(): TutorialSectionContent {
    return {
      title: 'Being Prey',
      description: stripIndents`
        Even with a big stomach, people are still out hunting. And you could always be next.
        If you get caught and swallowed, don't panic. There's some things you'll need to know about this.

        - 1. This is only temporary, once you're digested (unless you have permadeath mode on, which we'll talk about later) or released, you're back to normal.
        - 2. You cannot use any commands (besides the ping command or commands that require you to be outside someone - like extract, eat, etc.).
        - 3. You're completely fine, nothing is gonna happen to you. Yet.

        **How To Escape:**

        Escaping a pred isn't easy, in fact... any try to escape is just gonna pleasure the pred. Your fate will lie within the pred.
        **They decide what to do with you.**

        They can either:

        - A. Release you, and nothing goes wrong. The pred gets money, but that doesn't come from your balance (yet).
        - B. Digest you, which will cause you to die, lose all your bones that you didn't extract and reform you (or... respawn as the normies call it).

        **Permadeath Mode:**

        This bot features something else for hardcore prey, **Permadeath Mode**, which is off by default (and probably barely used).
        When this is on, if you're glorped (digested), that's final. You'll understand what it really does when we talk about it in detail.

        ---

        If you're caught and released, you just might want to watch your back next time.
        Just to make sure you don't end up as another layer of pudge on someone.

        **Next is one small thing, permadeath mode. What it is, and what it provides...**
      `,
    }
  }
}
