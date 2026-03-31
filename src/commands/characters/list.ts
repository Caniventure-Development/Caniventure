import { type CommandContext, Declare, SubCommand } from 'seyfert'
import { CharacterListSubcommand } from '#base/subcommands/characters/list.ts'

@Declare({
  name: 'list',
  description: 'List all of your characters',
})
export default class ListCharactersSubCommand extends SubCommand {
  public override async run(ctx: CommandContext) {
    new CharacterListSubcommand().run(ctx)
  }
}
