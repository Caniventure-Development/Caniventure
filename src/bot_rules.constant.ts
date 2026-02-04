import { commaListsAnd, commaListsOr, stripIndents } from 'common-tags'

export const RULES: Readonly<string> = Object.freeze(stripIndents`
    ${commaListsOr`
        # Caniventure Rules

        Welcome to Caniventure, the cannibalistic economy bot. This is a bot meant
        to bring some uniqueness to economy bots on Discord, by being a bot based around eating people (aka vore), this bot is absolutely not
        for everyone, and has some rules. You are able to decline, and you won't be bothered by this bot until you agree.

        If you do not like the idea of this bot,
        or don't agree with the rules, do not continue using Caniventure.

        ## Rules

        - 1. Do not use Caniventure for illegal activities.
        - 2. Do not ${['harass', 'witch hunt', 'otherwise hurt users']} for using Caniventure.
        - 3. ${['Xenophobic', 'Discriminatory']} behavior is not tolerated by ${['Caniventure Development', 'its members']}.
        - 4. Do not exploit any mechanics in Caniventure.
        - 5. Follow Discord's ${commaListsAnd`${['TOS', 'Community Guidelines']}`} **AT ALL TIMES**.

        ---

        Any breaking of these rules may result in being blacklisted from the bot. So... don't break them. :)
    `}
`)
