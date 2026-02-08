import type { Awaitable } from '@sapphire/utilities'
import type { AutocompleteInteraction } from 'seyfert'

export default abstract class AutocompleteCommand {
  public abstract run(interaction: AutocompleteInteraction): Awaitable<any>
}
