import { stripIndents } from 'common-tags'
import type { CommandContext } from 'seyfert'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class CharacterListSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { author, ui, utilities } = ctx
    const { userDocuments } = utilities

    const user = await userDocuments.forceGetUser(author.id)
    const characters = (await user.getCharacters())
      .toArray()
      .sort((a, b) => a.name.localeCompare(b.name))
    const aliveCharacters = characters.filter(
      (character) => !character.isPermad
    )
    const activeCharacter = await user.getActiveCharacter()

    const charactersEmbed = ui.embeds.info(`Your Characters`, {
      description: stripIndents`
        You have **${characters.length}** ${characters.length === 1 ? 'character' : 'characters'}, **${
          aliveCharacters.length === characters.length
            ? 'all'
            : aliveCharacters.length
        }** of which are not permanent pudge.

        Your characters are:
        ${characters
          .map((character) => {
            if (character.isPermad)
              return `- ~~${character.name} _(former ${character.species})_~~`

            const base = `- **${character.name} (${character.species})**`

            if (characters.length === 1) return base

            if (character.characterId === activeCharacter.characterId)
              return `${base} (active)`

            return base
          })
          .join('\n')}
      `,
    })

    await ctx.editOrReply({
      embeds: [charactersEmbed],
    })
  }
}
