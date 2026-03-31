import { CooldownType } from '@slipher/cooldown'
import type { AnyContext, Interaction } from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'
import { UserCharacterMeasurementSystem } from '#entities/user/character.entity.ts'
import { BaseUtilityWithContext } from './base.ts'

type UnitType = 'height' | 'weight'

export class HelpersUtility extends BaseUtilityWithContext {
  public async handleNotImplemented<T extends Interaction>(
    interaction: T,
    message = 'Sorry, this method was not implemented yet! It should be ready soon though, maybe!'
  ) {
    const notImplementedEmbed = this.ui.embeds.danger('Not Implemented', {
      description: message,
    })

    await interaction.editOrReply({
      embeds: [notImplementedEmbed],
      flags: MessageFlags.Ephemeral,
    })
  }

  /**
   * Waits for a specified amount of milliseconds before resolving.
   * @param ms The amount of milliseconds to wait.
   */
  public async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public removeCooldown(
    ctx: AnyContext,
    id: string,
    cooldownType: CooldownType = CooldownType.User
  ) {
    if (!('fullCommandName' in ctx)) return

    const actualCommandName = ctx.fullCommandName as string

    const { fullCommandName } = ctx.client.handleCommand.getCommandFromContent(
      actualCommandName.split(' ').filter(Boolean).slice(0, 3)
    )

    if (
      !ctx.client.cooldown.has({
        name: fullCommandName,
        target: id,
      })
    )
      return

    ctx.client.cooldown.resource.remove(
      `${fullCommandName}:${cooldownType}:${id}`
    )
  }

  public unitToImperial(
    value: number,
    unit: UserCharacterMeasurementSystem,
    type: UnitType
  ) {
    if (unit === UserCharacterMeasurementSystem.Imperial) return value

    return type === 'height'
      ? Math.round(value * 0.393701) // cm -> inches
      : Math.round(value * 2.20462) // kg -> lbs
  }

  public unitToMetric(
    value: number,
    unit: UserCharacterMeasurementSystem,
    type: UnitType
  ) {
    if (unit === UserCharacterMeasurementSystem.Metric) return value

    return type === 'height'
      ? Math.round(value * 2.54) // inches -> cm
      : Math.round(value * 0.453592) // lbs -> kg
  }
}
