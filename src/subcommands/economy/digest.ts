import { Time } from '@sapphire/timestamp'
import { stripIndents } from 'common-tags'
import { type CommandContext, Formatter } from 'seyfert'
import { TimestampStyle } from 'seyfert/lib/common'
import npcs, { NpcSize } from '#base/npcs.ts'
import { BaseBotChatInputSubcommand } from '#subcommands/index.ts'
import StomachCharacter from '#utilities/stomach_character.ts'

export class DigestSubcommand extends BaseBotChatInputSubcommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply()

    const { author, client, ui, utilities } = ctx
    const em = client.em.fork()
    const { helpers, random, userDocuments } = utilities
    const { wait } = helpers

    const user = await userDocuments.forceGetUser(author.id, {
      populate: ['balance', 'states', 'stomach'],
    })
    em.persist(user)

    const { states, stomach } = user

    states.isDigesting = true

    await em.flush()

    const timeAsMillis = Time.Second * stomach.digestionTime
    const timestamp = Formatter.timestamp(
      new Date(timeAsMillis + Date.now()),
      TimestampStyle.RelativeTime
    )

    const baseMessage = 'Your stomach gurgles, eager to break down this meal...'
    const counterMessage = `Your belly is working out **${stomach.currentSize}** prey...`
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

        ${counterMessage}

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
      "Your prey tried fighting against inevitable doom, but are now unconscious. They're at the mercy of your stomach now..."
    const preyUnconsciousEmbed = ui.embeds.info(null, {
      description: stripIndents`
        ${baseMessageDigestionUnderwayMessage}

        ${counterMessage}

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
    const predatorActiveCharacter = await user.getActiveCharacter()

    em.persist(predatorActiveCharacter)

    let bonesEarned = 0
    let weightGain = 0

    for (const opponent of opponentsInside) {
      const opponentNameSplit = opponent.split(' ')
      const size = opponentNameSplit.at(0)?.toLowerCase() as NpcSize // e.g. Small Rabbit -> Small
      const species = opponentNameSplit.at(-1) // e.g. Small Rabbit -> Rabbit
      const npc = npcs.find(
        (npc) => npc.species.toLowerCase() === species?.toLowerCase()
      )

      if (!npc) continue

      let minimum: number // Inclusive
      let maximum: number // Exclusive, 11 becomes 10 for example.

      switch (size) {
        case NpcSize.Tiny:
          minimum = 0
          maximum = 11
          break

        case NpcSize.Small:
          minimum = 10
          maximum = 31
          break

        case NpcSize.Medium:
          minimum = 30
          maximum = 61
          break

        case NpcSize.Large:
          minimum = 60
          maximum = 101
          break

        case NpcSize.Huge:
          minimum = 110
          maximum = 181
          break

        default:
          continue // Invalid NpcSize, move to the next NPC.
      }

      weightGain += random.next(minimum, maximum)
      bonesEarned += npc.bones
    }

    for (const userId of usersInside) {
      const user = await userDocuments.getUser(userId, {
        populate: ['balance', 'settings'],
      })

      if (!user) continue

      em.persist(user)

      const baseBonesEarned = 206

      user.isInStomach = false
      user.captorId = null

      const preyCharacter = await user.getActiveCharacter()
      const minimumGain = 100
      weightGain += Math.max(
        minimumGain,
        random.next(minimumGain, preyCharacter.weight + 1)
      )

      if (user.settings.permavoreModeOn) {
        const discord = await user.getDiscord(client)

        em.persist(preyCharacter)

        preyCharacter.setPermavored(author.id)

        let message = `You were permavored by ${author.username}! ${preyCharacter.name} is now forever belly fat for their captor. Permavore mode has been switched off.`

        const characters = await user.getCharacters()
        const nonPermadCharacters = characters.filter((char) => !char.isPermad)
        const firstNonPermadCharacter = nonPermadCharacters[0]

        if (firstNonPermadCharacter) {
          message += `\n\n**${firstNonPermadCharacter.name} is now your active character.**`
          await user.setActiveCharacter(firstNonPermadCharacter)
        }

        if (discord) {
          const embed = ui.embeds.warning('Permavored!', {
            description: message,
            footer: {
              text: "Hopefully they'll be comfy in their new permanent home and their new squishy job.",
            },
          })

          const dmResult = await utilities.results.fromAsync(async () => {
            const dm = await discord.dm()
            const { messages } = dm

            await messages.write({ embeds: [embed] })
          })

          if (dmResult.isErr())
            client.logger.error(
              `Failed to DM ${discord.username}: ${dmResult.unwrapErr()}`
            )
        }
      }

      if (user.balance.bonesInStomach > 0) {
        const bonesCollectedFromUser =
          baseBonesEarned + user.balance.bonesInStomach / random.nextFloat(2, 5)
        bonesEarned += bonesCollectedFromUser

        user.balance.bonesInStomach = 0
        continue
      }

      bonesEarned += baseBonesEarned
    }

    let description = stripIndents`
        ${baseMessageDigestionUnderwayMessage}

        ~~${counterMessage}~~

        ~~${acidsRisingMessage}~~

        ~~${preyUnconsciousMessage}~~

        **Your stomach lets out one last large gurgle letting you know it's done. Your prey is just food to you now, and they're with you forever.**
        **It now has ${bonesEarned} new bones ready for extraction!**
      `

    if (weightGain > 0)
      description += `\n\n
       Your character also feels a bit heavier from all the extra pudge, **they gained ${weightGain} pounds from their meal.**
    `

    description += `\n\n
      ${StomachCharacter.digested()}
    `

    const doneEmbed = ui.embeds.success(null, {
      description,
    })

    predatorActiveCharacter.weight += weightGain
    user.endDigestion(bonesEarned)

    await ctx.editOrReply({
      embeds: [doneEmbed],
    })
    await em.flush()
  }
}
