import { Subcommand } from "../../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { ButtonStyle, ComponentType } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { createGuild, getGuild } from "../../utils/prismaUtils";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("register-guild")
        .setDescription(
            "Registers this guild in the database, needs to be executed by the server owner to work."
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true });
        const guild = interaction.guild;

        if (interaction.user.id !== guild?.ownerId) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    "This command can only be executed by the server owner, if you are the server owner, please report this as a bug."
                );

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        let errorOccurredWhileCheckingData = false;
        const data = await getGuild(guild?.id!).catch(async (error) => {
            console.error(error);
            errorOccurredWhileCheckingData = true;

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("Well, that didn't go to plan.")
                .setDescription(
                    "There was an error while trying to check for existing data in the database. Please contact the Caniventure team."
                );

            await interaction.editReply({ embeds: [embed] });
            return;
        });

        if (errorOccurredWhileCheckingData) {
            return;
        }

        if (data) {
            const embed = new EmbedBuilder()
                .setColor(0xffff00)
                .setTitle("Existing Data Found")
                .setDescription("This guild is already registered.");

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const confirmEmbed = new EmbedBuilder()
            .setColor(0xffff00)
            .setTitle("Please confirm your registration")
            .setDescription(
                "Are you sure you want the guild to be registered? This cannot be undone unless you contact the Caniventure team!"
            );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel("Confirm")
                .setCustomId("confirm"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("Cancel")
                .setCustomId("cancel")
        );

        const msg = await interaction.editReply({
            embeds: [confirmEmbed],
            components: [row],
        });

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: async (i) => {
                if (i.user.id !== interaction.user.id) {
                    await i.reply({
                        content: "That's... not your button.",
                        ephemeral: true,
                    });
                    return false;
                }

                return true;
            },
            max: 1,
        });

        collector.on("end", async (collected) => {
            if (
                collected.size === 0 ||
                collected.first()?.customId === "cancel"
            ) {
                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setDescription("Registration cancelled.");

                await interaction.editReply({
                    embeds: [embed],
                    components: [],
                });
            } else if (collected.first()?.customId === "confirm") {
                createGuild(guild?.id!)
                    .then(async () => {
                        const embed = new EmbedBuilder()
                            .setColor(0x00ff00)
                            .setDescription("This guild has been registered.");

                        await interaction.editReply({
                            embeds: [embed],
                            components: [],
                        });
                    })
                    .catch(async (error) => {
                        console.error(error);

                        const embed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle("Well, that didn't go to plan.")
                            .setDescription(
                                "There was an error while trying to create the guild in the database. Please contact the Caniventure team."
                            );

                        await interaction.editReply({
                            embeds: [embed],
                            components: [],
                        });
                        return;
                    });
            }
        });
    },
} as Subcommand;
