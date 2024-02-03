import { Subcommand } from "../../types";
import {
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";
import { prisma, getGuild } from "../../utils/prismaUtils";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("remove-custom-opponent")
        .setDescription("Remove a custom opponent from this guild")
        .addStringOption((option) =>
            option
                .setName("id")
                .setDescription("The ID for the custom opponent to delete")
                .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const guild = interaction.guild!;
        const guildData = await getGuild(interaction.guildId!);

        if (!guildData) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `No data for ${interaction.guild?.name} was found! Please get the server owner to run the \`/other register-guild\` command.`
                );
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        if (
            interaction.user.id !== guild.ownerId &&
            !guildData.options.peopleAllowedToChangeSettings.includes(
                interaction.user.id
            )
        ) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `You don't have permission to use this command!`
                );

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const id = interaction.options.getString("id", true);

        if (
            !guildData.options.customOpponents.some(
                (opponent) => opponent.id === id
            )
        ) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription("No custom opponent with that ID was found!");

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        await prisma.guilds.update({
            where: {
                id: guild.id,
            },
            data: {
                options: {
                    update: {
                        customOpponents: {
                            set: guildData.options.customOpponents.filter(
                                (opponent) => opponent.id !== id
                            ),
                        },
                    },
                },
            },
        });

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setDescription(`Removed custom opponent with ID \`${id}\``);

        await interaction.editReply({ embeds: [embed] });
    },
} as Subcommand;
