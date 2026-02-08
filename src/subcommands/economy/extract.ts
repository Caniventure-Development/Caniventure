/* eslint-disable @stylistic/quotes */
import { Time } from '@sapphire/timestamp'
import { stripIndents } from 'common-tags'
import { Formatter, type CommandContext } from 'seyfert'
import { TimestampStyle } from 'seyfert/lib/common'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'

export class ExtractSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { author, client, ui, utilities } = ctx
    const { helpers, random, userDocuments } = utilities
    const { wait } = helpers

    const em = client.em.fork()

    const user = (await userDocuments.getUser(author.id, {
      populate: ['balance'],
    }))!
    em.persist(user)

    const { balance } = user

    const timeToRegurgitate = Time.Second * random.next(5, 20)
    const timestamp = Formatter.timestamp(
      new Date(Date.now() + timeToRegurgitate),
      TimestampStyle.RelativeTime
    )

    const baseMessage =
      "You're ready to use these bones to make yourself more powerful."
    const regurgitatingMessage =
      "You're regurgitating the bones from your stomach, this may take a moment..."
    const regurgitatingEmbed = ui.embeds.info(null, {
      description: stripIndents`
        ${baseMessage}

        **${regurgitatingMessage}**

        ---

        Done ${timestamp}
      `,
    })

    await ctx.editOrReply({
      embeds: [regurgitatingEmbed],
    })

    await wait(timeToRegurgitate)

    const doneEmbed = ui.embeds.success(null, {
      description: stripIndents`
        ${baseMessage}

        ~~${regurgitatingMessage}~~

        ---

        **All ${balance.bonesInStomach} bones that were in your stomach land on the floor and make a satisfying clacking sound. You pick them up.**
        **They're all yours now...**
      `,
    })

    balance.bonesCollected += balance.bonesInStomach
    balance.bonesInStomach = 0

    await ctx.editOrReply({
      embeds: [doneEmbed],
    })
    await em.flush()
  }
}
