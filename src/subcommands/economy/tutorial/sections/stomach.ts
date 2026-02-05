import { stripIndents } from 'common-tags'
import { TutorialSection, type TutorialSectionContent } from '../section.ts'

export class TutorialStomachSection extends TutorialSection {
  public override getContent(): TutorialSectionContent {
    return {
      title: 'Your Stomach',
      description: stripIndents`
        Your stomach is your main weapon and tool when using Caniventure. Gurgling, groaning, glorping and ready to fill with acids, or just a comfy
        home for food you've eaten.

        Currently, it's extremely hungry and **normal food won't suffice its hunger.** **It wants something different...** something... **alive.**

        However it can only hold one of these "things" _(for right now)_. We'll talk about what it is in particular in the next section.

        **Checking Your Stomach:**

        Use the \`/stomach check\` command to check your stomach and its food (although it might feel weird the first time, just saying...)

        **Fate Decision:**

        When you have food in your stomach, you can do one of two things with it, you are the decider of their fate.

        - **Digest** (fatal) -> This should be self-explanatory, but this just melts your food into nothing but extra fat and calories on you. You also earn **bones** from this (the fatal currency).
        - **Endo** (safe) -> When you decide this, you decide to just hold onto your food for a bit before letting them go and run free. You will earn **money** from this (the safe currency).

        **Growth:**

        Your stomach is not locked to only being able to hold one piece of food, as you level up
        it can fit more into it. Although you might feel hungrier each time it grows. So... fair warning.

        ---

        All right, off to the next section. You'll learn about what "food" is in this bot's universe... might want to hang onto something for this,
        because it's gonna get weird...
      `,
    }
  }
}
