import { Time } from '@sapphire/timestamp'
import { Cooldown } from '@slipher/cooldown'
import {
  type CommandContext,
  Declare,
  Middlewares,
  Options,
  createStringOption,
} from 'seyfert'
import { ExtendedSubCommand } from '../extended_base.ts'
import { HuntSubcommand } from '#subcommands/economy/hunt.ts'
import npcs from '#base/npcs.ts'
import HuntingTargetAutocomplete from '#components/autocomplete/hunting_target_autocomplete.ts'

const options = {
  target: createStringOption({
    async autocomplete(interaction) {
      return new HuntingTargetAutocomplete().run(interaction)
    },
    description:
      'Your hunting target (can be a name or a size (text or number), uses autocomplete)',
    required: true,
  }),
}

@Declare({
  name: 'hunt',
  description: 'Attempt to turn an NPC into a small snack',
})
@Cooldown({
  type: 'user',
  uses: { default: 1 },
  interval: Time.Minute * 3,
})
@Middlewares([
  'cooldown',
  'hasDocument',
  'hasTutorialDone',
  'isNotFull',
  'isNotDigesting',
  'isNotRegurgitating',
  'isNotInPvp',
  'isNotSwallowed',
])
@Options(options)
export default class HuntSubCommand extends ExtendedSubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    const selectedNpcSpecies = ctx.options.target.toLowerCase()

    const npc = npcs.find((npc) => npc.species === selectedNpcSpecies)

    if (!npc) {
      await ctx.editOrReply({
        content:
          "Invalid NPC Provided, this shouldn't be possible. Blame my creator", // eslint-disable-line @stylistic/quotes
      })
      return
    }

    await new HuntSubcommand().run(ctx, npc)
  }
}
