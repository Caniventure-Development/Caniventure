import { Subcommand } from "../../types";
import {
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";
import { getUserOrCreate } from "../../utils/databaseUtils";
import {
    deleteCooldown,
    minutesToSeconds,
    secondsToMilli,
} from "../../utils/helpers";
import { users } from "../../models";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("digest")
        .setDescription("Start digesting your prey to win their bones"),
    extra_data: {
        cooldown: {
            time: secondsToMilli(minutesToSeconds(1)),
        },
    },
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const userData = await getUserOrCreate(interaction.user.id);

        if (userData.peopleInStomach.length === 0) {
            deleteCooldown("digest", userData.id);

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You do not have any prey in your stomach! Go eat someone, then come back!`
                );

            await interaction.editReply({
                embeds: [embed],
            });
            return;
        }

        const earnings = 206 * userData.peopleInStomach.length;

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setDescription(
                `You have successfully earned **${earnings}** bones, they're now in your stomach! Make sure to run \`/predator extract\` before you go on the prey side if you want to do that!`
            );

        await interaction.editReply({ embeds: [embed] });

        await users.findOneAndUpdate({
            id: interaction.user.id,
        },
            {
                $set: {
                    peopleInStomach: [],
                },
                $inc: {
                    bonesInStomach: earnings,
                }
            },
        );
    },
} as Subcommand;
