import { commaListsAnd, commaListsOr, stripIndents } from 'common-tags'

export const RULES: Readonly<string> = Object.freeze(stripIndents`
    ${commaListsOr`
        # Vorasion Rules

        Welcome to Vorasion, a Discord bot with a voracious attitude. This is a bot meant
        to bring some uniqueness to economy bots on Discord, by being a bot based around eating living things (aka vore), this bot is absolutely not
        for everyone, and has some rules. You are able to decline, and you won't be bothered by this bot until you agree.

        If you do not like the idea of this bot,
        or don't agree with the rules, do not continue using Vorasion.

        ## Rules

        - 1. Do not use Vorasion for illegal activities.
        - 2. Do not ${['harass', 'witch hunt', 'otherwise hurt users']} for using Vorasion.
        - 3. ${['Xenophobic', 'Discriminatory']} behavior is not tolerated by ${['Vorasion Development', 'its members']}.
        - 4. Do not exploit any mechanics in Vorasion.
        - 5. Follow Discord's ${commaListsAnd`${['TOS', 'Community Guidelines']}`} **AT ALL TIMES**.

        ---

        Any breaking of these rules may result in being blacklisted from the bot. So... don't break them. :)
    `}
`)
