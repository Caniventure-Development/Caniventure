import { Subcommand } from "../../types";
import {
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";
import { prisma, getGuild } from "../../utils/prismaUtils";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("add-custom-opponent")
        .setDescription("Create a brand new custom opponent for this guild")
        .addStringOption((option) =>
            option
                .setName("id")
                .setDescription("The ID for this custom opponent")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("The name for this custom opponent")
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName("difficulty_level")
                .setDescription(
                    "How hard or easy it is to swallow or escape the opponent"
                )
                .setMinValue(1)
                .setMaxValue(6)
                .setRequired(true)
                .addChoices(
                    {
                        name: "Easy",
                        value: 1,
                    },
                    {
                        name: "Medium",
                        value: 2,
                    },
                    {
                        name: "Hard",
                        value: 3,
                    },
                    {
                        name: "Very Hard",
                        value: 4,
                    },
                    {
                        name: "Extremely Hard",
                        value: 5,
                    },
                    {
                        name: "Impossible",
                        value: 6,
                    }
                )
        )
        .addIntegerOption((option) =>
            option
                .setName("bones_in_stomach")
                .setDescription(
                    "How many bones are in the stomach of this opponent, defaults to 0"
                )
                .setRequired(false)
                .setMinValue(0)
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
        const name = interaction.options.getString("name", true);
        const difficultyLevel = interaction.options.getNumber(
            "difficulty_level",
            true
        );
        const bonesInStomach =
            interaction.options.getInteger("bones_in_stomach") || 0;

        if (
            guildData.options.customOpponents.some(
                (opponent) => opponent.id === id
            )
        ) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    "A custom opponent with that ID already exists!"
                );

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        guildData.options.customOpponents.push({
            id,
            name,
            difficultyLevel,
            bonesInStomach,
        });

        await prisma.guilds.update({
            where: {
                id: guild.id,
            },
            data: {
                options: guildData.options,
            },
        });

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Added Custom Opponent")
            .setDescription(
                `Added a new custom opponent with the ID \`${id}\` and name \`${name}\`, enjoy!`
            );

        await interaction.editReply({ embeds: [embed] });
    },
} as Subcommand;
