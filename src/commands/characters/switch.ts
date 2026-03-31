import { Time } from '@sapphire/timestamp'
import { Cooldown } from '@slipher/cooldown'
import {
  type CommandContext,
  createStringOption,
  Declare,
  Options,
  SubCommand,
} from 'seyfert'
import CharacterAutocomplete from '#base/components/autocomplete/character_autocomplete.ts'

const options = {
  character: createStringOption({
    description: 'The character to switch to',
    required: true,
    autocomplete: (interaction) => new CharacterAutocomplete().run(interaction),
  }),
}

@Cooldown({
  interval: Time.Second * 5,
  type: 'user',
  uses: { default: 1 },
})
@Declare({
  name: 'switch',
  description: 'Switch to one of your other characters',
})
@Options(options)
export default class SwitchCharacterSubCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply(true)

    const { author, client, options, utilities, ui } = ctx
    const { em: emToFork } = client
    const em = emToFork.fork()

    const characterId = options.character

    const user = await utilities.userDocuments.forceGetUser(author.id)

    em.persist(user)

    const characters = await user.getCharacters()
    const activeCharacter = await user.getActiveCharacter()

    if (activeCharacter.characterId === characterId) {
      await ctx.editOrReply({
        content: `**${activeCharacter.name}** is already your active character!`,
      })
      return
    }

    const character = characters.find(
      (character) => character.characterId === characterId
    )

    if (!character) {
      await ctx.editOrReply({
        content: 'An invalid character was provided! It could not be found!',
      })
      return
    }

    const settingResult = await utilities.results.fromAsync(async () => {
      await user.setActiveCharacter(character)
      await em.flush()
    })

    if (settingResult.isErr()) {
      const error = settingResult.unwrapErr()
      console.error(error)

      const failedToSetCharacterEmbed = ui.embeds.error('Failed!', {
        description: `I failed to set **${character.name}** as the active character! Here's why: ${error.message}`,
      })
      await ctx.editOrReply({
        embeds: [failedToSetCharacterEmbed],
      })
      return
    }

    const doneEmbed = ui.embeds.success('Done!', {
      description: `**${character.name}** is now your active character!`,
    })
    await ctx.editOrReply({
      embeds: [doneEmbed],
    })
  }
}
