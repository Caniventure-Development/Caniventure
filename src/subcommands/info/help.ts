/* eslint-disable @stylistic/object-curly-newline */
import { titleCase } from '@luca/cases'
import { Time } from '@sapphire/timestamp'
import { Command, SubCommand, type CommandContext, type Embed } from 'seyfert'
import type { CreateComponentCollectorResult } from 'seyfert/lib/components/handler'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

const getSubcommands = (cmd: Command) =>
  cmd.options?.filter((option) => option instanceof SubCommand) ?? []

export class HelpSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { ui, utilities } = ctx

    const commands = ctx.client.commands.values
      .filter((cmd) => cmd instanceof Command)
      .sort((a, b) => a.name.localeCompare(b.name))

    const commandEmbeds = commands.map((cmd) => {
      if (!cmd.options)
        return ui.embeds.info(cmd.name, {
          description: 'No subcommands',
        })

      const subcommandsInCommand = getSubcommands(cmd).sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      const subcommandsLength = subcommandsInCommand.length

      return ui.embeds.info(`${titleCase(cmd.name)} (\`${cmd.name}\`)`, {
        description: `${subcommandsLength} ${subcommandsLength === 1 ? 'subcommand' : 'subcommands'}`,
        fields: subcommandsInCommand.map((sub) => ({
          name: sub.name,
          value: sub.description,
        })),
      })
    })

    if (commandEmbeds.length === 0) {
      await ctx.editOrReply({ content: 'There are no commands to show!' })
      return
    }

    const startingIndex = 0
    const startingEmbed = commandEmbeds[startingIndex]!
    const message = await ctx.editOrReply(
      {
        components: [
          this.buildComponents(ctx, startingIndex, commandEmbeds.length),
        ],
        embeds: [startingEmbed],
      },
      true
    )

    const collector = utilities.collectors.create(
      ctx.interaction,
      message,
      'button',
      {
        timeout: Time.Minute * 5,
      }
    )

    this.handlePagination(ctx, collector, commandEmbeds, startingIndex)
  }

  private handlePagination(
    ctx: CommandContext,
    collector: CreateComponentCollectorResult,
    embeds: Embed[],
    pageIndex: number
  ) {
    collector.run(this.previousButtonCustomId, async (interaction) => {
      collector.stop()
      await interaction.deferUpdate()

      const newIndex = pageIndex - 1
      if (newIndex < 0) return

      const message = await interaction.editResponse(
        this.loadPage(ctx, embeds, newIndex)
      )

      const newCollector = ctx.utilities.collectors.create(
        ctx.interaction,
        message,
        'button',
        {
          timeout: Time.Minute * 5,
        }
      )

      this.handlePagination(ctx, newCollector, embeds, newIndex)
    })

    collector.run(this.nextButtonCustomId, async (interaction) => {
      collector.stop()
      await interaction.deferUpdate()

      const newIndex = pageIndex + 1
      if (newIndex >= embeds.length) return

      const message = await interaction.editResponse(
        this.loadPage(ctx, embeds, newIndex)
      )

      const newCollector = ctx.utilities.collectors.create(
        ctx.interaction,
        message,
        'button',
        {
          timeout: Time.Minute * 5,
        }
      )

      this.handlePagination(ctx, newCollector, embeds, newIndex)
    })
  }

  private loadPage(ctx: CommandContext, embeds: Embed[], newIndex: number) {
    const page = embeds[newIndex]

    if (!page) throw new Error('Invalid page index ' + newIndex)

    return {
      components: [this.buildComponents(ctx, newIndex, embeds.length)],
      embeds: [page],
    }
  }

  private buildComponents(
    ctx: CommandContext,
    sectionIndex: number,
    max: number
  ) {
    const { ui } = ctx

    return ui.actionRows.multiComponents(
      ui.buttons.primary(this.previousButtonCustomId, {
        label: 'Previous',
        disabled: sectionIndex === 0,
      }),
      ui.buttons.primary(this.nextButtonCustomId, {
        label: 'Next',
        disabled: sectionIndex + 1 >= max,
      })
    )
  }

  private get previousButtonCustomId() {
    return 'prev'
  }

  private get nextButtonCustomId() {
    return 'next'
  }
}
