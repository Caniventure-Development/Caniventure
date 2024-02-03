import { Subcommand } from "../../types";
import {
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";
import { prisma, getGuild } from "../../utils/prismaUtils";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("language-filter")
        .setDescription(
            "Check or set whether or not the guild has language filter enabled"
        )
        .addBooleanOption((option) =>
            option
                .setName("enabled")
                .setDescription(
                    "Whether or not the guild has language filter enabled"
                )
                .setRequired(false)
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

        const enabled = interaction.options.getBoolean("enabled");

        if (enabled === null) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x00ff00)
                        .setDescription(
                            `Language filter is ${
                                guildData.options.languageFilterOn
                                    ? "enabled"
                                    : "disabled"
                            }`
                        ),
                ],
            });
            return;
        }

        await prisma.guilds.update({
            where: {
                id: guild.id,
            },
            data: {
                options: {
                    update: {
                        languageFilterOn: enabled,
                    },
                },
            },
        });

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setDescription(
                `Language filter has been set to ${
                    enabled ? "enabled" : "disabled"
                }`
            );

        await interaction.editReply({ embeds: [embed] });
    },
} as Subcommand;
