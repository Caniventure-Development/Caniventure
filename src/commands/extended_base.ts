import { Time } from '@sapphire/timestamp'
import { stripIndents } from 'common-tags'
import { SubCommand, type CommandContext } from 'seyfert'
import levels from '#base/levels.ts'

export abstract class ExtendedSubCommand extends SubCommand {
  // Useful for while I'm testing the command. :)
  private excluded = false

  public exclude() {
    this.excluded = true
  }

  public override async onAfterRun(
    ctx: CommandContext,
    error: unknown | undefined
  ) {
    if (error) return

    await this.handleLeveling(ctx)
  }

  private async handleLeveling(ctx: CommandContext) {
    if (this.excluded) return

    const { author, client, ui, utilities } = ctx
    const em = client.em.fork()

    const user = await utilities.userDocuments.getUser(author.id)

    if (!user) return

    em.persist(user)

    const minExperience = 20
    const maxExperience = 101 // (exclusive, so... 100)
    const experienceEarned = utilities.random.next(minExperience, maxExperience)

    const { experience } = user
    const currentUserLevel = user.level
    const newExperience = experience + experienceEarned

    user.experience = newExperience

    const nextLevel = levels.find(
      (level) => level.number === currentUserLevel + 1
    )

    if (nextLevel && user.experience >= nextLevel.experienceRequired) {
      await user.populate(['stomach'])
      const { capacityIncrease, number } = nextLevel

      user.level += 1
      user.stomach.capacity += capacityIncrease

      const levelUpEmbed = ui.embeds.info('Level Up!', {
        description: stripIndents`
        You have leveled up from level ${currentUserLevel} to ${number}! Your stomach has gotten bigger and can hold ${capacityIncrease} more ${capacityIncrease === 1 ? 'person' : 'people'}!

        **Well done ${author.name}!**`,
        footer: {
          text: 'This message will automatically self destruct in 10 seconds.',
        },
      })

      const message = await ctx.followup({
        embeds: [levelUpEmbed],
      })

      setTimeout(() => message.delete(), Time.Second * 10) // eslint-disable-line @typescript-eslint/promise-function-async
    }

    await em.flush()
  }
}
