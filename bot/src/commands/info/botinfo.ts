import { PageData, Subcommand } from "../../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { ButtonStyle, ComponentType } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import os from "os";
import { commands } from "../../handlers/commandHandler";
import { disableAllButtons, secondsToMilli } from "../../utils/helpers";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("botinfo")
        .setDescription("View information about the bot"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        let embed = new EmbedBuilder().setColor(0x00ffff);

        const dataPieces: PageData[] = [
            {
                embedTitle: "Bot Information",
                embedFields: [
                    {
                        name: "Server Count",
                        value: interaction.client.guilds.cache.size.toString(),
                        inline: true,
                    },
                    {
                        name: "User Count",
                        value: interaction.client.users.cache.size.toString(),
                        inline: true,
                    },
                    {
                        name: "Command Count",
                        value: Object.keys(commands).length.toString(),
                        inline: true,
                    },
                ],
            },
            {
                embedTitle: "Version Information",
                embedFields: [
                    {
                        name: "Discord.js Version",
                        value: `v${require("discord.js").version}`,
                        inline: true,
                    },
                    {
                        name: "Node.js Version",
                        value: `${process.version}`,
                        inline: true,
                    },
                ],
            },
            {
                embedTitle: "Operating System Information",
                embedFields: [
                    {
                        name: "CPU",
                        value: `${os.cpus()[0].model} (${
                            os.cpus()[0].speed
                        } MHz)`,
                        inline: true,
                    },
                    {
                        name: "Uptime",
                        value: `${os.uptime()} seconds`,
                        inline: true,
                    },
                    {
                        name: "Total Memory",
                        value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(
                            2
                        )} GB`,
                        inline: true,
                    },
                    {
                        name: "Free Memory",
                        value: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(
                            2
                        )} GB`,
                        inline: true,
                    },
                    {
                        name: "Platform",
                        value: `${os.platform()}`,
                        inline: true,
                    },
                    {
                        name: "Architecture",
                        value: `${os.arch()}`,
                        inline: true,
                    },
                ],
            },
        ];
        const pages: { pageNumber: number; data: PageData }[] = [
            {
                pageNumber: 1,
                data: dataPieces[0],
            },
            {
                pageNumber: 2,
                data: dataPieces[1],
            },
            {
                pageNumber: 3,
                data: dataPieces[2],
            },
        ];

        let currentPageNumber = 1;
        const maxPages = pages.length;
        let currentData = pages[currentPageNumber - 1].data;

        function loadPage() {
            currentData = pages[currentPageNumber - 1].data;

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
                .setCustomId("previous")
                .setLabel("Previous")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(currentPageNumber === 1)
                .setEmoji({
                    name: "⬅️",
                }),
            new ButtonBuilder()
                .setCustomId("next")
                .setLabel("Next")
                .setStyle(ButtonStyle.Success)
                .setDisabled(currentPageNumber === maxPages)
                .setEmoji({
                    name: "➡️",
                })
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
            time: secondsToMilli(120),
        });

        collector.on("collect", async (i) => {
            if (i.customId === "previous") {
                if (currentPageNumber === 1) {
                    return;
                }

                currentPageNumber--;

                embed = loadPage();

                for (const button of row.components) {
                    if (button.data.label === "Previous") {
                        button.setDisabled(currentPageNumber === 1);
                    } else if (button.data.label === "Next") {
                        button.setDisabled(currentPageNumber === maxPages);
                    }
                }

                await i.update({
                    embeds: [embed],
                    components: [row],
                });
            } else if (i.customId === "next") {
                if (currentPageNumber === maxPages) {
                    return;
                }

                currentPageNumber++;

                embed = loadPage();

                for (const button of row.components) {
                    if (button.data.label === "Next") {
                        button.setDisabled(currentPageNumber === maxPages);
                    } else if (button.data.label === "Previous") {
                        button.setDisabled(currentPageNumber === 1);
                    }
                }

                await i.update({
                    embeds: [embed],
                    components: [row],
                });
            }
        });

        collector.on("end", async () => {
            embed = embed
                .setColor(0xffff00)
                .setDescription(
                    "This interaction collector has expired. Please re-execute the command if you want to see more of this data."
                );

            disableAllButtons(row);

            await interaction.editReply({ embeds: [embed], components: [row] });
        });
    },
} as Subcommand;
