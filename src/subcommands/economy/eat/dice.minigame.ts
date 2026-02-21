import type { EntityManager } from '@mikro-orm/postgresql'
import { Time } from '@sapphire/timestamp'
import { stripIndents } from 'common-tags'
import type {
  CommandContext,
  Embed,
  InteractionGuildMember,
  ListenerOptions,
  Message,
  User as SeyfertUser,
  ThreadChannel,
} from 'seyfert'
import type { CollectorInteraction } from 'seyfert/lib/components/handler'
import { ChannelType } from 'seyfert/lib/types'
import StomachCharacter from '#base/utilities/stomach_character.ts'
import type { User } from '#entities/user/user.entity.ts'
import { BaseBotMinigame } from '#subcommands/index.ts'

type AnySeyfertUser = InteractionGuildMember | SeyfertUser
type EatSubcommandDiceMinigamePredator = [AnySeyfertUser, User]
type EatSubcommandDiceMinigamePrey = [AnySeyfertUser, User]
type EatSubcommandDiceMinigameUsers = [
  EatSubcommandDiceMinigamePredator,
  EatSubcommandDiceMinigamePrey,
]

export class EatSubcommandDiceMinigame extends BaseBotMinigame {
  public override async run(
    interaction: CollectorInteraction,
    ctx: CommandContext,
    users: EatSubcommandDiceMinigameUsers
  ) {
    const [predatorGroup, preyGroup] = users
    const [author, predator] = predatorGroup
    const [user, prey] = preyGroup

    if (predator.states.isInPvp || prey.states.isInPvp) {
      this.removeCooldown(ctx, ctx.author.id)
      const alreadyInPvpEmbed = ctx.ui.embeds.error('Already in a game!', {
        description:
          'Either you or your prey is already in a PvP minigame, you cannot start another one!',
      })

      await interaction.editOrReply({ embeds: [alreadyInPvpEmbed] })
      return
    }

    const [predThreadGroup, preyThreadGroup] = await this.createThreads(
      author,
      user,
      ctx
    )
    const [predThread, predMessage] = predThreadGroup
    const [preyThread, preyMessage] = preyThreadGroup

    const em = ctx.client.em.fork()

    em.persist(predator).persist(prey)

    predator.states.isInPvp = true
    prey.states.isInPvp = true
    await em.flush()

    await ctx.utilities.helpers.wait(Time.Second * 10)

    this.handleMinigame(
      interaction,
      ctx,
      predatorGroup,
      preyGroup,
      predThread,
      preyThread,
      predMessage,
      preyMessage,
      em
    )
  }

  private async handleMinigame(
    interaction: CollectorInteraction,
    ctx: CommandContext,
    predatorGroup: EatSubcommandDiceMinigamePredator,
    preyGroup: EatSubcommandDiceMinigamePrey,
    predThread: ThreadChannel,
    preyThread: ThreadChannel,
    predMessage: Message,
    preyMessage: Message,
    em: EntityManager,
    predatorScore = 0,
    preyScore = 0,
    isPreyGuessing = false
  ) {
    /*
     * The minigame will be as follows, both the predator and prey will roll a die. The game will alternate between them, and they have to guess whether
     * the opposite side rolled higher or lower. If they guess right, they get a point, if they guess wrong, their opponent gets a point.
     * If they are the same number, nobody gets a point. First to 5 points wins. Loser become lunch.
     */
    const winningScore = 5
    const [author, predator] = predatorGroup
    const [user, prey] = preyGroup

    const { ui, utilities } = ctx
    const { random } = utilities

    if (predatorScore >= winningScore) {
      await this.handleVictory(
        ctx,
        predThread,
        preyThread,
        predMessage,
        preyMessage,
        predatorGroup,
        preyGroup,
        em,
        true,
        predatorScore,
        preyScore
      )
      return
    } else if (preyScore >= winningScore) {
      await this.handleVictory(
        ctx,
        predThread,
        preyThread,
        predMessage,
        preyMessage,
        preyGroup,
        predatorGroup,
        em,
        false,
        preyScore,
        predatorScore
      )
      return
    }

    const min = 1
    const max = 6
    const exclusiveMax = max + 1

    const predatorRoll = random.next(min, exclusiveMax)
    const preyRoll = random.next(min, exclusiveMax)

    const basePredRolledMessage = `You rolled a ${predatorRoll}`
    const basePreyRolledMessage = `You rolled a ${preyRoll}`

    const footer = {
      text: `Predator Score: ${predatorScore} | Prey Score: ${preyScore} | First to ${winningScore} wins!`,
    }

    const predRolledEmbedWithGuess = ui.embeds.info('You rolled the die...', {
      description: `**${basePredRolledMessage}**! It's your turn to guess, did your opponent roll higher or lower than you?`,
      footer,
    })
    const predRolledEmbedNoGuess = ui.embeds.info('You rolled the die...', {
      description: `**${basePredRolledMessage}**! Your opponent has to guess whether they rolled higher or lower than you! Waiting for their guess...`,
      footer,
    })

    const preyRolledEmbedWithGuess = ui.embeds.info('You rolled the die...', {
      description: `**${basePreyRolledMessage}**! Now it's your turn to guess! Do you think they rolled higher or lower than you?`,
      footer,
    })
    const preyRolledEmbedNoGuess = ui.embeds.info('You rolled the die...', {
      description: `**${basePreyRolledMessage}**! Now your opponent has to guess whether they rolled higher or lower than you! Waiting for their guess...`,
      footer,
    })

    const actionRow = ui.actionRows.multiComponents(
      ui.buttons.success('higher', 'Higher'),
      ui.buttons.danger('lower', 'Lower')
    )

    const [predMessageDup, preyMessageDup] = await Promise.all([
      predMessage.edit({
        embeds: [
          isPreyGuessing ? predRolledEmbedNoGuess : predRolledEmbedWithGuess,
        ],
        components: !isPreyGuessing ? [actionRow] : [],
      }),
      preyMessage.edit({
        embeds: [
          !isPreyGuessing ? preyRolledEmbedNoGuess : preyRolledEmbedWithGuess,
        ],
        components: isPreyGuessing ? [actionRow] : [],
      }),
    ])

    const filter = (i: CollectorInteraction) => {
      if (isPreyGuessing) {
        return i.user.id === user.id && ['higher', 'lower'].includes(i.customId)
      } else {
        return (
          i.user.id === author.id && ['higher', 'lower'].includes(i.customId)
        )
      }
    }

    const messageCollectorOptions: ListenerOptions = {
      filter,
      timeout: Time.Minute * 5,
      async onStop(reason) {
        const reasonsToResetState = [
          'messageDelete',
          'channelDelete',
          'guildDelete',
          'idle',
          'timeout',
        ]

        if (reason && reasonsToResetState.includes(reason)) {
          predator.states.isInPvp = false
          prey.states.isInPvp = false
          await em.flush()
        }

        if (reason === 'timeout') {
          const timeoutEmbed = ui.embeds.error('Game Timed Out', {
            description:
              'The game has timed out due to inactivity. No one wins, no one gets food. Sorry everyone...',
          })
          await predThread.delete()
          await preyThread.delete()
          await ctx.editOrReply({
            content: null,
            embeds: [timeoutEmbed],
            components: [],
          })
        }
      },
    }

    const collector = isPreyGuessing
      ? preyMessageDup.createComponentCollector(messageCollectorOptions)
      : predMessageDup.createComponentCollector(messageCollectorOptions)

    async function handleTie(
      handleMinigame: (...args: unknown[]) => Promise<void>
    ) {
      if (predatorRoll === preyRoll) {
        const tieEmbed = ui.embeds.info("It's a tie!", {
          description: `Same roll! Let's try again.`,
          footer,
        })
        await Promise.all([
          predMessageDup.edit({ embeds: [tieEmbed], components: [] }),
          preyMessageDup.edit({ embeds: [tieEmbed], components: [] }),
        ])
        await utilities.helpers.wait(Time.Second * 5)
        handleMinigame(
          interaction,
          ctx,
          predatorGroup,
          preyGroup,
          predThread,
          preyThread,
          predMessageDup,
          preyMessageDup,
          em,
          predatorScore,
          preyScore,
          isPreyGuessing
        )
        return false
      }

      return true
    }

    collector.run('higher', async (interaction) => {
      await interaction.deferUpdate()

      const actualIsHigher = !isPreyGuessing
        ? preyRoll > predatorRoll
        : predatorRoll > preyRoll
      const canContinue = await handleTie(() =>
        this.handleMinigame(
          interaction,
          ctx,
          predatorGroup,
          preyGroup,
          predThread,
          preyThread,
          predMessageDup,
          preyMessageDup,
          em,
          predatorScore,
          preyScore,
          isPreyGuessing
        )
      )

      if (!canContinue) return

      let predatorNewScore = predatorScore
      let preyNewScore = preyScore
      let predSideEmbed: Embed
      let preySideEmbed: Embed

      if (actualIsHigher) {
        if (isPreyGuessing) {
          preyNewScore++
          preySideEmbed = ui.embeds.success('You guessed correctly!', {
            description: `Nice job! You guessed that the roll would be higher and you were right!`,
            footer,
          })
          predSideEmbed = ui.embeds.error(
            'Your opponent guessed correctly...',
            {
              description: `Your opponent guessed that the roll would be higher and they were right... Seems you're closer to being lunch.`,
              footer,
            }
          )
        } else {
          predatorNewScore++
          predSideEmbed = ui.embeds.success('You guessed correctly!', {
            description: `Nice job! You guessed that the roll would be higher and you were right!`,
            footer,
          })
          preySideEmbed = ui.embeds.error(
            'Your opponent guessed correctly...',
            {
              description: `Your opponent guessed that the roll would be higher and they were right... Seems you're closer to being lunch.`,
              footer,
            }
          )
        }
      } else {
        if (isPreyGuessing) {
          predatorNewScore++
          predSideEmbed = ui.embeds.success('Your opponent guessed wrong!', {
            description: `Your opponent guessed that the roll would be higher but they were wrong! Seems like they're closer to being lunch than you now!`,
            footer,
          })
          preySideEmbed = ui.embeds.error('You guessed wrong...', {
            description: `Uh oh... You guessed that the roll would be higher but you were wrong... Seems like you're closer to being lunch now...`,
            footer,
          })
        } else {
          preyNewScore++
          preySideEmbed = ui.embeds.success('Your opponent guessed wrong', {
            description: `Your opponent guessed that the roll would be higher but they were wrong! Seems like they're closer to being lunch than you now!`,
            footer,
          })
          predSideEmbed = ui.embeds.error('You guessed wrong...', {
            description: `Uh oh... You guessed that the roll would be higher but you were wrong... Seems like you're closer to being lunch now...`,
            footer,
          })
        }
      }

      if (isPreyGuessing)
        await Promise.all([
          interaction.editOrReply({ embeds: [preySideEmbed], components: [] }),
          predMessageDup.edit({ embeds: [predSideEmbed], components: [] }),
        ])
      else
        await Promise.all([
          interaction.editOrReply({ embeds: [predSideEmbed], components: [] }),
          preyMessageDup.edit({ embeds: [preySideEmbed], components: [] }),
        ])

      await utilities.helpers.wait(Time.Second * 10)

      await this.handleMinigame(
        interaction,
        ctx,
        predatorGroup,
        preyGroup,
        predThread,
        preyThread,
        predMessageDup,
        preyMessageDup,
        em,
        predatorNewScore,
        preyNewScore,
        !isPreyGuessing
      )
    })

    collector.run('lower', async (interaction) => {
      await interaction.deferUpdate()

      const actualIsLower = !isPreyGuessing
        ? preyRoll < predatorRoll
        : predatorRoll < preyRoll
      const canContinue = await handleTie(() =>
        this.handleMinigame(
          interaction,
          ctx,
          predatorGroup,
          preyGroup,
          predThread,
          preyThread,
          predMessageDup,
          preyMessageDup,
          em,
          predatorScore,
          preyScore,
          isPreyGuessing
        )
      )

      if (!canContinue) return

      let predatorNewScore = predatorScore
      let preyNewScore = preyScore
      let predSideEmbed: Embed
      let preySideEmbed: Embed

      if (actualIsLower) {
        if (isPreyGuessing) {
          preyNewScore++
          preySideEmbed = ui.embeds.success('You guessed correctly!', {
            description: `Nice job! You guessed that the roll would be lower and you were right!`,
            footer,
          })
          predSideEmbed = ui.embeds.error(
            'Your opponent guessed correctly...',
            {
              description: `Your opponent guessed that the roll would be lower and they were right... Seems you're closer to being lunch.`,
              footer,
            }
          )
        } else {
          predatorNewScore++
          predSideEmbed = ui.embeds.success('You guessed correctly!', {
            description: `Nice job! You guessed that the roll would be lower and you were right!`,
            footer,
          })
          preySideEmbed = ui.embeds.error(
            'Your opponent guessed correctly...',
            {
              description: `Your opponent guessed that the roll would be lower and they were right... Seems you're closer to being lunch.`,
              footer,
            }
          )
        }
      } else {
        if (isPreyGuessing) {
          predatorNewScore++
          predSideEmbed = ui.embeds.success('Your opponent guessed wrong!', {
            description: `Your opponent guessed that the roll would be lower but they were wrong! Seems like they're closer to being lunch than you now!`,
            footer,
          })
          preySideEmbed = ui.embeds.error('You guessed wrong...', {
            description: `Uh oh... You guessed that the roll would be lower but you were wrong... Seems like you're closer to being lunch now...`,
            footer,
          })
        } else {
          preyNewScore++
          preySideEmbed = ui.embeds.success('Your opponent guessed wrong', {
            description: `Your opponent guessed that the roll would be lower but they were wrong! Seems like they're closer to being lunch than you now!`,
            footer,
          })
          predSideEmbed = ui.embeds.error('You guessed wrong...', {
            description: `Uh oh... You guessed that the roll would be lower but you were wrong... Seems like you're closer to being lunch now...`,
            footer,
          })
        }
      }

      if (isPreyGuessing)
        await Promise.all([
          interaction.editOrReply({ embeds: [preySideEmbed], components: [] }),
          predMessageDup.edit({ embeds: [predSideEmbed], components: [] }),
        ])
      else
        await Promise.all([
          interaction.editOrReply({ embeds: [predSideEmbed], components: [] }),
          preyMessageDup.edit({ embeds: [preySideEmbed], components: [] }),
        ])

      await utilities.helpers.wait(Time.Second * 10)

      await this.handleMinigame(
        interaction,
        ctx,
        predatorGroup,
        preyGroup,
        predThread,
        preyThread,
        predMessageDup,
        preyMessageDup,
        em,
        predatorNewScore,
        preyNewScore,
        !isPreyGuessing
      )
    })
  }

  private async handleVictory(
    ctx: CommandContext,
    predThread: ThreadChannel,
    preyThread: ThreadChannel,
    predMessage: Message,
    preyMessage: Message,
    winnerGroup: EatSubcommandDiceMinigamePredator,
    loserGroup: EatSubcommandDiceMinigamePrey,
    emToFork: EntityManager,
    winnerIsPredator: boolean,
    winnerScore: number,
    loserScore: number
  ) {
    const getUserMention = this.getUserMention
    const [winner, predator] = winnerGroup
    const [loser, prey] = loserGroup
    const { ui, utilities } = ctx
    const { helpers } = utilities
    const baseEditOptions = {
      components: [],
      content: null,
    }

    const em = emToFork.fork()
    em.persist(predator).persist(prey)

    if (winnerIsPredator) {
      const victoryEmbed = ui.embeds.success('You win!', {
        description: stripIndents`
        Good work! You are looking at ${getUserMention(loser)} with a really hungry gaze.
        Seems they know what's about to happen to them...

        ${StomachCharacter.hungry()}`,
      })
      const lostEmbed = ui.embeds.error('Uh oh...', {
        description: stripIndents`
        Looks like ${getUserMention(winner)} bested you. Might want to prepare for a really slimy trip...

        ${StomachCharacter.sad()}`,
      })
      await Promise.all([
        predMessage.edit({ ...baseEditOptions, embeds: [victoryEmbed] }),
        preyMessage.edit({ ...baseEditOptions, embeds: [lostEmbed] }),
      ])
    } else {
      const tablesTurnedEmbed = ui.embeds.success('Unexpected Twist!', {
        description: stripIndents`
        Wow, you actually won against ${getUserMention(loser)}! Not bad at all. You look at them right in their eyes, feeling their fear... they know
        they're about to be your meal, and there's nothing they can do about it!

        ${StomachCharacter.hungry()}`,
      })
      const lostEmbed = ui.embeds.error('Uh oh...', {
        description: stripIndents`
        You got too cocky, seems ${getUserMention(winner)} is gonna be giving you a taste of your own medicine now...
        Better prepare for a really slimy trip...

        ${StomachCharacter.sad()}`,
      })
      await Promise.all([
        predMessage.edit({ ...baseEditOptions, embeds: [lostEmbed] }),
        preyMessage.edit({ ...baseEditOptions, embeds: [tablesTurnedEmbed] }),
      ])
    }

    await helpers.wait(Time.Second * 10)

    predator.stomach.addUser(loser.id)
    predator.states.isInPvp = false
    prey.states.isInPvp = false
    prey.isInStomach = true
    prey.captorId = winner.id

    const stomachText = StomachCharacter.atePlayer()

    const footer = {
      text: `Congratulations ${winner.username}, you won the dice minigame and got yourself a nice meal!`,
    }
    const eatenEmbed = ui.embeds.info(`${loser.username} has been eaten!`, {
      description: winnerIsPredator
        ? stripIndents`
          ${getUserMention(winner)} is now enjoying their meal... Hopefully ${getUserMention(loser)} is very filling.
          Although knowing them, they probably won't be full.

          ${stomachText}`
        : stripIndents`
          ${getUserMention(loser)} got too cocky and ended up being a meal for ${getUserMention(winner)}.
          Better luck next time, and hopefully you'll be comfortable inside your captor!

          ${stomachText}`,
      footer,
    })

    await em.flush()
    await Promise.all([
      predThread.delete(),
      preyThread.delete(),
      ctx.editOrReply({
        content: `**${winner.username}** won against **${loser.username}** with a score of ${winnerScore} to ${loserScore}!`,
        embeds: [eatenEmbed],
        components: [],
      }),
    ])
  }

  private async createThreads(
    predatorUser: AnySeyfertUser,
    preyUser: AnySeyfertUser,
    ctx: CommandContext
  ): Promise<[[ThreadChannel, Message], [ThreadChannel, Message]]> {
    const { client, ui } = ctx
    const { threads } = client
    const channelId = ctx.channelId
    const threadChannelType = ChannelType.PrivateThread
    const autoArchiveDuration = 60

    const predThread = await threads.create(channelId, {
      auto_archive_duration: autoArchiveDuration,
      invitable: false,
      name: `${predatorUser.username} (Predator)`,
      type: threadChannelType,
    })

    const preyThread = await threads.create(channelId, {
      auto_archive_duration: autoArchiveDuration,
      invitable: false,
      name: `${preyUser.username} (Prey)`,
      type: threadChannelType,
    })

    const startingMessage = ui.embeds.info('Welcome in!', {
      description: `This is where the dice minigame will take place! The predator (${predatorUser.username}) will play in their thread, and the prey (${preyUser.username}) will play in theirs. The loser is lunch. Have fun, the game will start soon!`,
    })

    const [_memAdd1, _memAdd2, predMessage, preyMessage] = await Promise.all([
      threads.addMember(predThread.id, predatorUser.id),
      threads.addMember(preyThread.id, preyUser.id),
      predThread.messages.write({ embeds: [startingMessage] }),
      preyThread.messages.write({ embeds: [startingMessage] }),
    ])

    return [
      [predThread, predMessage],
      [preyThread, preyMessage],
    ]
  }
}
