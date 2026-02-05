import { stripIndents } from 'common-tags'
import { TutorialSection, type TutorialSectionContent } from '../section.ts'

export class TutorialVoraciousSection extends TutorialSection {
  public override getContent(): TutorialSectionContent {
    // This would be time accurate, if timezones weren't a fucking bitch.
    // Note to self, **FUCK** timezones.
    const timings = [
      'during their morning hunt',
      'as a midday lunch',
      'for their evening dinner',
      'as just another late-night craving',
    ]
    const timing = timings[Math.floor(Math.random() * timings.length)]

    return {
      title: 'Being Voracious',
      description: stripIndents`
        In the last section, we mentioned "food". And that it's "alive". Which means this isn't your ordinary food, like an apple or an orange.
        Nope, these are living **THINGS**. And I do mean living.

        Your **very voracious** diet will consist of living things, mostly animals, monsters, and other players of the bot. Some will be willing and easy
        to take down, while most will just struggle until they're in your stomach.

        **Remember:** Interacting with users is not a free meal just by saying you want to eat them,
        they have to consent to the challenge, and respect is key. We're all here to have fun after all!

        But keep in mind, you're not always safe even with the
        biggest stomach on the leaderboard... someone out there could see **YOU** ${timing}. The hunter can become the hunted!

        **Next is learning how to actually get that gurgling stomach some actual food to work with!**
      `,
    }
  }
}
