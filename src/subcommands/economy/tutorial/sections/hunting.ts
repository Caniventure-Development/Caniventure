import { stripIndents } from 'common-tags'
import { TutorialSection, type TutorialSectionContent } from '../section.ts'

export class TutorialHuntingSection extends TutorialSection {
  public override getContent(): TutorialSectionContent {
    return {
      title: 'Hunting',
      description: stripIndents`
        **This is a big part of the bot, so you might want to pay attention.**

        Hunting is the main source of eating when using Caniventure. Every hunt is associated with a minigame. Right now, you'll only be able
        to catch your prey off guard. But eventually you'll learn more (if my creator gets more ideas), you'll be able to play a blackjack ripoff (or... improvement)... and more!

        There are a few commands for hunting:

        - \`/economy hunt\` -> Where you go after an NPC, usually animals.
        - \`/economy blackjack\` _(coming soon)_ -> A custom version of Blackjack that uses your capacity as your '21', you'll learn about it later (when my creator actually makes it)
        - \`/economy eat\` _(coming soon)_ -> This is the PvP command, where you go after another player and try to swallow them. But if you fail... you're dinner for them.

        Your stomach is very eager to do some work, and I'm sure you are. But there are people out there, you're not always safe.
        **The next section will cover the second side of the bot...**
      `,
    }
  }
}
