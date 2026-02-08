/* eslint-disable no-await-in-loop */
/* eslint-disable capitalized-comments */
/* eslint-disable @stylistic/no-mixed-operators */
import { Time } from '@sapphire/timestamp'
import { stripIndents } from 'common-tags'
import { type CommandContext, Formatter } from 'seyfert'
import { TimestampStyle } from 'seyfert/lib/common'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'
import StomachCharacter from '#utilities/stomach_character.ts'
import npcs from '#base/npcs.ts'

export class DigestSubcommand extends BaseBotChatInputSubcommand {
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

    const { balance, states, stomach } = user

    states.isDigesting = true

    await em.flush()

    const timeAsMillis = Time.Second * stomach.digestionTime
    const timestamp = Formatter.timestamp(
      new Date(timeAsMillis + Date.now()),
      TimestampStyle.RelativeTime
    )

    const baseMessage = 'Your stomach gurgles, eager to break down this meal...'
    const baseMessageDigestionUnderwayMessage =
      'Your stomach lets out large groans while working at your prey...'
    const acidsRisingMessage = 'The acids start filling your prison...'
    const timestampMessage = stripIndents`
      ---

      Digestion will be done ${timestamp}
    `
    const startingEmbed = ui.embeds.info(null, {
      description: stripIndents`
        ${baseMessage}

        **${acidsRisingMessage}**

        ${StomachCharacter.digesting()}

        ${timestampMessage}
      `,
    })
    const timeBetweenSwitches = timeAsMillis / 3

    await ctx.editOrReply({
      embeds: [startingEmbed],
    })

    await wait(timeBetweenSwitches)

    const preyUnconsciousMessage =
      "Your prey tried fighting against inevitable doom, but are now unconscious. They're at the mercy of your stomach now..." // eslint-disable-line @stylistic/quotes
    const preyUnconsciousEmbed = ui.embeds.info(null, {
      description: stripIndents`
        ${baseMessageDigestionUnderwayMessage}

        ~~${acidsRisingMessage}~~

        **${preyUnconsciousMessage}**

        ${StomachCharacter.digesting()}

        ${timestampMessage}
      `,
    })

    await ctx.editOrReply({
      embeds: [preyUnconsciousEmbed],
    })

    await wait(timeBetweenSwitches)

    const { opponentsInside, usersInside } = stomach
    let bonesEarned = 0

    for (const opponent of opponentsInside) {
      const species = opponent.split(' ').at(-1) // e.g. Small Rabbit
      const npc = npcs.find(
        (npc) => npc.species.toLowerCase() === species?.toLowerCase()
      )

      if (!npc) continue

      bonesEarned += npc.bones
    }

    for (const userId of usersInside) {
      const user = await userDocuments.getUser(userId, {
        populate: ['balance'],
      })

      if (!user) continue

      const baseBonesEarned = 206

      if (user.balance.bonesInStomach > 0) {
        const bonesCollectedFromUser =
          baseBonesEarned + user.balance.bonesInStomach / random.nextFloat(2, 5)
        bonesEarned += bonesCollectedFromUser

        user.balance.bonesInStomach = 0
        continue
      }

      bonesEarned += baseBonesEarned
    }

    const doneEmbed = ui.embeds.success(null, {
      description: stripIndents`
        ${baseMessageDigestionUnderwayMessage}

        ~~${acidsRisingMessage}~~

        ~~${preyUnconsciousMessage}~~

        **Your stomach lets out one last large gurgle letting you know it's done. Your prey is just food to you now, and they're with you forever.**
        **It now has ${bonesEarned} new bones ready for extraction!**

        ${StomachCharacter.digested()}
      `,
    })

    balance.bonesInStomach += bonesEarned
    states.isDigesting = false
    stomach.currentSize = 0
    stomach.opponentsInside = []
    stomach.usersInside = []

    await ctx.editOrReply({
      embeds: [doneEmbed],
    })
    await em.flush()
  }
}
