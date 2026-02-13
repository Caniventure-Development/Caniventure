import { stripIndents } from 'common-tags'
import { Command, Formatter, SubCommand, type CommandContext } from 'seyfert'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

const getSubcommands = (cmd: Command) =>
  cmd.options?.filter((option) => option instanceof SubCommand) ?? []

export class HelpSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const commands = ctx.client.commands.values.filter(
      (cmd) => cmd instanceof Command
    )

    const commandText = commands.map((cmd) => {
      if (!cmd.options) return

      const subcommandsInCommand = getSubcommands(cmd).sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      const subcommandsLength = subcommandsInCommand.length

      return (
        stripIndents`
        ${cmd.name} - ${subcommandsLength} ${subcommandsLength === 1 ? 'command' : 'commands'}
        ${subcommandsInCommand.map((sub) => `- ${sub.name} (${sub.description})`).join('\n')}
      ` + '\n'
      )
    })

    await ctx.editOrReply({
      content: stripIndents`
      **THIS IS TEMPORARY UNTIL MY CREATOR COMES UP WITH A BETTER LOOKING HELP MENU**

      ${Formatter.codeBlock(commandText.join('\n'))}
      `,
    })
  }
}
