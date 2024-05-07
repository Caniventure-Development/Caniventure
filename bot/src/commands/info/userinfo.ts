import { PageData, Subcommand } from "../../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { ButtonStyle, ComponentType } from "discord.js";
import type {
    APIEmbedField,
    ButtonInteraction,
    ChatInputCommandInteraction,
} from "discord.js";
import { getUser, getUserOrCreate } from "../../utils/databaseUtils";
import {
    disableAllButtons,
    hexToRgb,
    secondsToMilli,
} from "../../utils/helpers";

async function replyWithInvalidColor(interaction: ButtonInteraction) {
    if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
            content: "Invalid color. Please re-execute the command.",
            ephemeral: true,
        });
    } else {
        await interaction.editReply({
            content: "Invalid color. Please re-execute the command.",
        });
    }
}

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("userinfo")
        .setDescription("View information about yourself or another user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription(
                    "The user to view information about, if not provided, defaults to you"
                )
                .setRequired(false)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const user = interaction.options.getUser("user") ?? interaction.user;

        // Don't create data for another user against their will, that goes against the Privacy Policy.
        const userData =
            user.id === interaction.user.id
                ? await getUserOrCreate(interaction.user.id)
                : await getUser(user.id);

        if (!userData) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    `${user.username} does not have any data in the database, we will NOT be able to provide any information about them due to our privacy policy.`
                );

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const peopleInUser: APIEmbedField[] = userData.peopleInStomach.map(
            (person) => {
                return {
                    name: person.isAi ? "AI Player" : "Human Player",
                    value: `${person.amountOfPeopleInStomach} people in their stomach, with ${person.bonesInStomach} bones in their stomach`,
                    inline: true,
                };
            }
        );
        const badges: APIEmbedField[] = userData.badges.map((badge) => {
            if (badge.owned) {
                return {
                    name: `${badge.ownedIcon} ${badge.name}`,
                    value: badge.description,
                    inline: true,
                };
            } else {
                return {
                    name: `${badge.unownedIcon} ${badge.name}`,
                    value: `**UNOWNED** - ${badge.description}`,
                    inline: true,
                };
            }
        });

        const id = Math.ceil(Math.random() * 1000000); // To separate interactions

        const pages: PageData[] = [
            {
                embedTitle: "Generic Information",
                embedFields: [
                    {
                        name: "Username",
                        value: user.username,
                        inline: true,
                    },
                    {
                        name: "ID",
                        value: user.id,
                        inline: true,
                    },
                    {
                        name: "Inside of someone?",
                        value: userData.inStomach ? "Yes" : "No",
                        inline: true,
                    },
                    {
                        name: "In Hardcore?",
                        value: userData.inHardcore ? "Yes" : "No",
                        inline: true,
                    },
                    {
                        name: "PVP Enabled?",
                        value: userData.pvpOn ? "Yes" : "No",
                        inline: true,
                    },
                    {
                        name: "Blacklisted?",
                        value: userData.blacklisted ? "Yes" : "No",
                        inline: true,
                    },
                    {
                        name: "Report Banned?",
                        value: userData.reportBanned ? "Yes" : "No",
                        inline: true,
                    },
                ],
            },
            {
                embedTitle: "Badges",
                embedFields: badges,
            },
            {
                embedTitle: "Color Information",
                embedFields: [
                    {
                        name: "Skin Color",
                        value: userData.colors.skin,
                    },
                    {
                        name: "Stomach Color",
                        value: userData.colors.stomach,
                    },
                    {
                        name: "Acid Color",
                        value: userData.colors.acid,
                    },
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`preview-skin-color-${id}`)
                            .setLabel("Preview Skin Color")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`preview-stomach-color-${id}`)
                            .setLabel("Preview Stomach Color")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`preview-acid-color-${id}`)
                            .setLabel("Preview Acid Color")
                            .setStyle(ButtonStyle.Primary)
                    ),
                ],
            },
            {
                embedTitle: "Statistics",
                embedFields: [
                    {
                        name: "Total Number of Bones in Stomach",
                        value: userData.bonesInStomach.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Total Number of Bones",
                        value: userData.bonesCollected.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Stomach Capacity",
                        value: userData.stomachCapacity.toLocaleString(),
                        inline: true,
                    },
                ],
            },
            {
                embedTitle: "Items - Predator",
                embedFields: [
                    {
                        name: "Acid Spit",
                        value: userData.items.predator.acid.toLocaleString(),
                        inline: true,
                    },
                ],
            },
            {
                embedTitle: "Items - Prey",
                embedFields: [
                    {
                        name: "Lube",
                        value: userData.items.prey.lube.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Rat Poison",
                        value: userData.items.prey.poison.toLocaleString(),
                        inline: true,
                    },
                ],
            },
            {
                embedTitle: "People Inside of Stomach",
                embedFields:
                    peopleInUser.length === 0
                        ? [
                              {
                                  name: "None",
                                  value: `There are no people inside of ${user}`,
                                  inline: true,
                              },
                          ]
                        : peopleInUser,
            },
        ];

        let embed = new EmbedBuilder().setColor(0x00ffff);

        let currentPageNumber = 1;
        const maxPages = pages.length;

        let currentData = pages[currentPageNumber - 1];

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
                .setCustomId(`previous-page-${id}`)
                .setLabel("Previous")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(currentPageNumber === 1)
                .setEmoji({
                    name: "⬅️",
                }),
            new ButtonBuilder()
                .setCustomId(`next-page-${id}`)
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
            time: secondsToMilli(180),
        });

        collector.on("collect", async (i) => {
            if (i.customId === `previous-page-${id}`) {
                await i.deferUpdate();
                if (currentPageNumber !== 1) {
                    currentPageNumber--;
                    const data = pages[currentPageNumber - 1];
                    embed = loadPage();

                    for (const component of row.components) {
                        if (component.data.label === "Previous") {
                            component.setDisabled(currentPageNumber === 1);
                        } else if (component.data.label === "Next") {
                            component.setDisabled(
                                currentPageNumber === maxPages
                            );
                        }
                    }

                    const components = [row];

                    if (data.components) {
                        components.push(...data.components);
                    }

                    await i.editReply({ embeds: [embed], components });
                }
            } else if (i.customId === `next-page-${id}`) {
                await i.deferUpdate();

                if (currentPageNumber !== maxPages) {
                    currentPageNumber++;
                    const data = pages[currentPageNumber - 1];
                    embed = loadPage();

                    for (const component of row.components) {
                        if (component.data.label === "Previous") {
                            component.setDisabled(currentPageNumber === 1);
                        } else if (component.data.label === "Next") {
                            component.setDisabled(
                                currentPageNumber === maxPages
                            );
                        }
                    }

                    const components = [row];

                    if (data.components) {
                        components.push(...data.components);
                    }

                    await i.editReply({ embeds: [embed], components });
                }
            } else if (i.customId === `preview-skin-color-${id}`) {
                await i.deferReply({ ephemeral: true });

                const color = hexToRgb(userData.colors.skin);

                if (!color) {
                    await replyWithInvalidColor(i);
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor([color.red, color.green, color.blue])
                    .setTitle("Skin Color")
                    .setDescription(
                        `The color of ${user}'s skin is ${userData.colors.skin} (preview on the left).`
                    );

                await i.editReply({ embeds: [embed] });
            } else if (i.customId === `preview-stomach-color-${id}`) {
                await i.deferReply({ ephemeral: true });

                const color = hexToRgb(userData.colors.stomach);

                if (!color) {
                    await replyWithInvalidColor(i);
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor([color.red, color.green, color.blue])
                    .setDescription(
                        `The color of ${user}'s stomach walls is ${userData.colors.stomach} (preview on the left).`
                    );

                await i.editReply({ embeds: [embed] });
            } else if (i.customId === `preview-acid-color-${id}`) {
                await i.deferReply({ ephemeral: true });

                const color = hexToRgb(userData.colors.acid);

                if (!color) {
                    await replyWithInvalidColor(i);
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor([color.red, color.green, color.blue])
                    .setDescription(
                        `The color of ${user}'s acid is ${userData.colors.acid} (preview on the left).`
                    );

                await i.editReply({ embeds: [embed] });
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
