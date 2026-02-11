/* eslint-disable @stylistic/quotes */
/* eslint-disable no-await-in-loop */
/* eslint-disable capitalized-comments */
import { Time } from '@sapphire/timestamp'
import { stripIndents } from 'common-tags'
import { Formatter, type CommandContext } from 'seyfert'
import { TimestampStyle } from 'seyfert/lib/common'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'
import npcs from '#base/npcs.ts'
import StomachCharacter from '#base/utilities/stomach_character.ts'

export class ReleaseSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { author, client, ui, utilities } = ctx
    const em = client.em.fork()
    const { helpers, random, userDocuments } = utilities
    const { wait } = helpers

    const user = (await userDocuments.getUser(author.id, {
      populate: ['balance', 'states', 'stomach'],
    }))!
    em.persist(user)

    const { states, stomach } = user

    states.isRegurgitating = true
    await em.flush()

    const hackingOutTime = Time.Second * random.next(10, 31)
    const timestamp = Formatter.timestamp(
      new Date(Date.now() + hackingOutTime),
      TimestampStyle.RelativeTime
    )

    const baseMessage =
      "You decided to not hurt your prey and just let them out, they're happy about this."
    const hackingOutMessage =
      "You're starting to hack them out of their prison, this could take between 10 to 30 seconds..."

    const hackingOutPreyEmbed = ui.embeds.info(null, {
      description: stripIndents`
        ${baseMessage}

        **${hackingOutMessage}**

        ---

        They'll be out ${timestamp}.
      `,
    })

    await ctx.editOrReply({
      embeds: [hackingOutPreyEmbed],
    })

    await wait(hackingOutTime)

    const { opponentsInside, usersInside } = stomach
    let moneyEarned = 0

    for (const opponent of opponentsInside) {
      const species = opponent.split(' ').at(-1) // e.g. Small Rabbit
      const npc = npcs.find(
        (npc) => npc.species.toLowerCase() === species?.toLowerCase()
      )

      if (!npc) continue

      moneyEarned += npc.money
    }

    for (const userId of usersInside) {
      const user = await userDocuments.getUser(userId, {
        populate: ['balance'],
      })

      if (!user) continue

      moneyEarned += random.next(50, user.balance.money + 1)
    }

    const doneEmbed = ui.embeds.success(null, {
      description: stripIndents`
        ${baseMessage}

        ~~${hackingOutMessage}~~

        **And they're out, every single one of your prey thanked you profusely and you earned ${moneyEarned} money from them!**
        **Your stomach also let out a happy gurgle just to tell them they're welcome back any time!**

        ${StomachCharacter.happy()}
      `,
    })

    user.endRelease(moneyEarned)

    await ctx.editOrReply({
      embeds: [doneEmbed],
    })
    await em.flush()
  }
}
