import { Subcommand } from "../../types";
import {
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";
import { getUserOrCreate } from "../../utils/databaseUtils";
import { deleteCooldown } from "../../utils/helpers";
import { users } from "../../models";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("extract")
        .setDescription("Extract the bones from your digested prey!"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const userData = await getUserOrCreate(interaction.user.id);

        if (userData.bonesInStomach === 0) {
            deleteCooldown("extract", userData.id);

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    "Your stomach is empty of bones, you can't extract nothing!"
                );

            await interaction.editReply({
                embeds: [embed],
            });
            return;
        }

        await users.findOneAndUpdate(
            {
                id: interaction.user.id,
            },
            {
                $set: {
                    bonesInStomach: 0,
                },
                $inc: {
                    bonesCollected: userData.bonesInStomach,
                },
            }
        );

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Extraction Complete")
            .setDescription(
                `You have successfully extracted **${userData.bonesInStomach}** bones!\n\n**You can't use them for anything at the moment, the shop is coming to Alpha!**`
            );

        await interaction.editReply({
            embeds: [embed],
        });
    },
} as Subcommand;
