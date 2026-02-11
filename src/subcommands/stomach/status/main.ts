/* eslint-disable @stylistic/indent */
import { Time } from '@sapphire/timestamp'
import type { CommandContext } from 'seyfert'
import type { CreateComponentCollectorResult } from 'seyfert/lib/components/handler'
import type { CaniventureStomachStatusPage } from './page_base'
import preyPage from './pages/prey.ts'
import startPage from './pages/start.ts'
import type { User } from '#entities/user/user.entity.ts'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class StomachStatusSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { author, utilities } = ctx
    const { userDocuments } = utilities

    const user = (await userDocuments.getUser(author.id, {
      populate: ['balance', 'states', 'stomach'],
    }))!

    const startingPageIndex = 0
    const message = await ctx.editResponse(
      await this.loadPage(ctx, user, startingPageIndex)
    )

    const collector = utilities.collectors.create(
      ctx.interaction,
      message,
      'button',
      {
        timeout: Time.Minute * 5,
      }
    )

    this.handlePagination(ctx, collector, user, 0)
  }

  private handlePagination(
    ctx: CommandContext,
    collector: CreateComponentCollectorResult,
    user: User,
    pageIndex: number
  ) {
    const { pages } = this

    collector.run('prev', async (interaction) => {
      collector.stop()
      await interaction.deferUpdate()

      const newIndex = pageIndex - 1
      if (newIndex < 0) return

      const message = await interaction.editResponse(
        await this.loadPage(ctx, user, newIndex)
      )

      const newCollector = ctx.utilities.collectors.create(
        ctx.interaction,
        message,
        'button',
        {
          timeout: Time.Minute * 5,
        }
      )

      this.handlePagination(ctx, newCollector, user, newIndex)
    })

    collector.run('next', async (interaction) => {
      collector.stop()
      await interaction.deferUpdate()

      const newIndex = pageIndex + 1
      if (newIndex >= pages.length) return

      const pageLoader = pages[newIndex]

      if (!pageLoader) throw new Error('Invalid page index ' + newIndex)

      const message = await interaction.editResponse(
        await this.loadPage(ctx, user, newIndex)
      )

      const newCollector = ctx.utilities.collectors.create(
        ctx.interaction,
        message,
        'button',
        {
          timeout: Time.Minute * 5,
        }
      )

      this.handlePagination(ctx, newCollector, user, newIndex)
    })
  }

  private async loadPage(ctx: CommandContext, user: User, index: number) {
    const pageLoader = this.pages[index]

    if (!pageLoader) throw new Error('Invalid page index ' + index)

    const pageNumber = index + 1
    const embed = await pageLoader(ctx.client, user, ctx.ui)

    return {
      embeds: [
        embed
          .setFooter({
            text: `Page ${pageNumber} of ${this.pages.length}`,
          })
          .setThumbnail(
            ctx.author.avatarURL({
              extension: 'png',
              size: 512,
            })
          ),
      ],
      components: this.buildComponents(ctx, index),
    }
  }

  private buildComponents(ctx: CommandContext, pageIndex: number) {
    const { ui } = ctx
    const isLastPage = pageIndex === this.pages.length - 1
    const isFirstPage = pageIndex === 0

    const previousButtonCustomId = 'prev'
    const previousButtonLabel = 'Previous'

    const nextButtonCustomId = 'next'
    const nextButtonLabel = 'Next'

    return [
      ui.actionRows.multiComponents(
        isFirstPage
          ? ui.buttons.secondary(previousButtonCustomId, {
              label: previousButtonLabel,
              disabled: true,
            })
          : ui.buttons.primary(previousButtonCustomId, {
              label: previousButtonLabel,
            }),
        isLastPage
          ? ui.buttons.secondary(nextButtonCustomId, {
              label: nextButtonLabel,
              disabled: true,
            })
          : ui.buttons.primary(nextButtonCustomId, {
              label: nextButtonLabel,
            })
      ),
    ]
  }

  private get pages(): CaniventureStomachStatusPage[] {
    return [startPage, preyPage]
  }
}
