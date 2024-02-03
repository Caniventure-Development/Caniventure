import { PageData, Subcommand } from "../../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { ButtonStyle, ComponentType } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { getGuild } from "../../utils/prismaUtils";
import { getDifficultyLevelName, secondsToMilli } from "../../utils/helpers";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("custom-opponents")
        .setDescription("View all custom opponents for this guild"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const guild = interaction.guild;
        const guildData = await getGuild(guild?.id!);

        if (!guildData) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `No data for ${guild?.name} was found! Please get the server owner to run the \`/other register-guild\` command.`
                );

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        if (guildData.options.customOpponents.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `No custom opponents found for ${guild?.name}!`
                );

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const pages: PageData[] = guildData.options.customOpponents.map(
            (opponent) => {
                return {
                    embedTitle: opponent.name,
                    embedFields: [
                        {
                            name: "ID",
                            value: opponent.id,
                            inline: true,
                        },
                        {
                            name: "Bones in Stomach",
                            value: opponent.bonesInStomach.toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Difficulty Level",
                            value: `${getDifficultyLevelName(
                                opponent.difficultyLevel
                            )} (${opponent.difficultyLevel})`,
                            inline: true,
                        },
                    ],
                };
            }
        );

        let embed = new EmbedBuilder().setColor(0x00ffff);

        let currentPageNumber = 1;
        const maxPages = pages.length;
        let currentData: PageData = pages[currentPageNumber - 1];

        function loadPage() {
            currentData = pages[currentPageNumber - 1];

            return embed
                .setTitle(currentData.embedTitle)
                .setFields(currentData.embedFields)
                .setFooter({
                    text: `Page ${currentPageNumber}/${maxPages}`,
                });
        }

        embed = loadPage();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("previous")
                .setLabel("Previous Opponent")
                .setDisabled(currentPageNumber === 1),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setCustomId("next")
                .setLabel("Next Opponent")
                .setDisabled(currentPageNumber === maxPages)
        );

        const msg = await interaction.editReply({
            embeds: [embed],
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
            time: secondsToMilli(300),
        });

        collector.on("collect", async (i) => {
            await i.deferUpdate();

            if (i.customId === "previous") {
                if (currentPageNumber > 1) {
                    currentPageNumber--;

                    embed = loadPage();

                    for (const button of row.components) {
                        if (button.data.label === "Previous Opponent") {
                            button.setDisabled(currentPageNumber === 1);
                        } else if (button.data.label === "Next Opponent") {
                            button.setDisabled(currentPageNumber === maxPages);
                        }
                    }

                    await i.editReply({ embeds: [embed], components: [row] });
                }
            } else if (i.customId === "next") {
                if (currentPageNumber < maxPages) {
                    currentPageNumber++;

                    embed = loadPage();

                    for (const button of row.components) {
                        if (button.data.label === "Previous Opponent") {
                            button.setDisabled(currentPageNumber === 1);
                        } else if (button.data.label === "Next Opponent") {
                            button.setDisabled(currentPageNumber === maxPages);
                        }
                    }

                    await i.editReply({ embeds: [embed], components: [row] });
                }
            }
        });

        collector.on("end", async () => {
            embed = embed
                .setColor(0xffff00)
                .setDescription(
                    "This interaction collector has expired. Please re-execute the command to view more of the data."
                );

            for (const button of row.components) {
                button.setDisabled(true);
            }

            await interaction.editReply({ embeds: [embed], components: [row] });
        });
    },
} as Subcommand;
