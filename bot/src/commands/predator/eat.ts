import { Subcommand } from "../../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    SelectMenuBuilder,
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { ButtonStyle, ComponentType } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { getAllOpponents, getUserOrCreate } from "../../utils/databaseUtils";
import {
    deleteCooldown,
    getDifficultyLevelName,
    minutesToSeconds,
} from "../../utils/helpers";
import { swallowOpponentMinigame } from "../../game-logic/predator/swallow-minigame";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("eat")
        .setDescription("Eat an AI or another player")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription(
                    "The user to eat. Requires you and the target player to have PVP turned on."
                )
                .setRequired(false)
        ),
    extra_data: {
        cooldown: {
            time: minutesToSeconds(3),
            message:
                "I understand those people look very good to eat, but you can take a break from stressing your stomach! Try again in {time} minutes.",
        },
    },
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const user = interaction.options.getUser("user");
        const mainUser = await getUserOrCreate(interaction.user.id);

        if (mainUser.peopleInStomach.length >= mainUser.stomachCapacity) {
            deleteCooldown("eat", mainUser.id);

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("Looks like your stomach is full!")
                .setDescription(
                    "You might want to digest what's inside of you before trying to eat someone else or else we might lose you!"
                );

            await interaction.editReply({
                embeds: [embed],
            });
            return;
        }

        if (!user) {
            const opponents = await getAllOpponents(interaction.guildId!);

            if (opponents.length === 0) {
                deleteCooldown("eat", mainUser.id);

                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle("Huh, that's weird...")
                    .setDescription(
                        "Looks like there are no opponents yet, that shouldn't be the case... Please report this to the Caniventure team!"
                    );

                await interaction.editReply({
                    embeds: [embed],
                });
                return;
            }

            for (const opponent of opponents) {
                console.log(opponent);
            }

            const embed = new EmbedBuilder()
                .setColor(0x00ffff)
                .setTitle("Select an opponent")
                .setDescription(
                    "Use the select menu below to select an opponent to eat."
                );

            const selectMenu = new SelectMenuBuilder()
                .setCustomId("predator-opponent-select-menu")
                .setPlaceholder("Select an opponent")
                .addOptions(
                    opponents.map((opponent) => ({
                        label: opponent.name,
                        description: `Difficulty: ${getDifficultyLevelName(
                            opponent.difficultyLevel
                        )}`,
                        value: opponent.id,
                    }))
                );

            const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
                selectMenu
            );

            const msg = await interaction.editReply({
                embeds: [embed],
                components: [row],
            });

            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                filter: async (i) => {
                    if (i.user.id !== interaction.user.id) {
                        await i.reply({
                            content: "That's... not yours.",
                            ephemeral: true,
                        });
                        return false;
                    }

                    return true;
                },
                max: 1,
            });

            collector.on("collect", async (i) => {
                await i.deferUpdate();

                const opponentId = i.values[0];

                const opponent = opponents.find(
                    (opponent) => opponent.id === opponentId
                );

                if (!opponent) {
                    deleteCooldown("eat", mainUser.id);

                    const embed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle("Invalid Choice")
                        .setDescription(
                            "That's not a valid choice. Please try again."
                        );

                    await interaction.editReply({
                        embeds: [embed],
                    });
                    return;
                }

                const confirmationEmbed = new EmbedBuilder()
                    .setColor(0x00ffff)
                    .setTitle("All right, take a deep breath...")
                    .setDescription(
                        `You're about to attempt to swallow ${opponent.name}. Are you sure you want to do this? If you confirm, the minigame will start.`
                    );

                const confirmationRow =
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("confirm")
                            .setLabel("All right, let's do this!")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("cancel")
                            .setLabel("Nope! I can't do it!")
                            .setStyle(ButtonStyle.Danger)
                    );

                const confirmationMsg = await interaction.editReply({
                    embeds: [confirmationEmbed],
                    components: [confirmationRow],
                });

                const confirmationCollector =
                    confirmationMsg.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        filter: async (i) => {
                            if (i.user.id !== interaction.user.id) {
                                await i.reply({
                                    content: "That's... not yours.",
                                    ephemeral: true,
                                });
                                return false;
                            }

                            return true;
                        },
                        max: 1,
                    });

                confirmationCollector.on("collect", async (i) => {
                    await i.deferUpdate();

                    if (i.customId === "confirm") {
                        await swallowOpponentMinigame(
                            mainUser,
                            opponent,
                            interaction
                        );
                    } else if (i.customId === "cancel") {
                        deleteCooldown("eat", mainUser.id);

                        const cancelledEmbed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle(
                                "All right, no problem. Operation cancelled."
                            )
                            .setDescription(
                                "You don't have to do this if you don't want to. Feel free to come back at any time. You do not have a cooldown from this, don't worry."
                            );

                        await interaction.editReply({
                            embeds: [cancelledEmbed],
                            components: [],
                        });
                    }
                });
            });

            return;
        }

        deleteCooldown("eat", mainUser.id);
        await interaction.editReply({
            content:
                "PvP is not here yet! Stay tuned for Alpha, where the PvP system will come so you can have fun eating your friends!",
        });
    },
} as Subcommand;
