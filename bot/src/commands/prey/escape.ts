import { Subcommand } from "../../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    SelectMenuBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { ButtonStyle, ComponentType } from "discord.js";
import type {
    ButtonInteraction,
    ChatInputCommandInteraction,
    StringSelectMenuInteraction,
} from "discord.js";
import {
    deleteCooldown,
    getDifficultyLevelName,
    minutesToSeconds,
} from "../../utils/helpers";
import { getAllOpponents, getUserOrCreate } from "../../utils/databaseUtils";
import { escapeOpponentMinigame } from "../../game-logic/prey/escape-minigame";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("escape")
        .setDescription(
            "Attempt an escape from the stomach of an AI (or your captor)"
        )
        .addBooleanOption((option) =>
            option
                .setName("from_captor")
                .setDescription("Whether or not to escape from your captor")
                .setRequired(false)
        ),
    extra_data: {
        cooldown: {
            time: minutesToSeconds(3),
            message:
                "Escaping someones' stomach is fun and all, but you can take a break.",
        },
    },
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const fromCaptor = interaction.options.getBoolean("from_captor");
        const mainUser = await getUserOrCreate(interaction.user.id);

        if (!fromCaptor) {
            const opponents = await getAllOpponents(interaction.guildId!);

            if (opponents.length === 0) {
                deleteCooldown("escape", mainUser.id);

                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle("Well, that's not right...")
                    .setDescription(
                        "There are no opponents to escape from. That shouldn't be possible, please report this to the Caniventure team!"
                    );

                await interaction.editReply({
                    embeds: [embed],
                });
                return;
            }

            const selectEmbed = new EmbedBuilder()
                .setColor(0x00ffff)
                .setTitle("Select an opponent")
                .setDescription(
                    "Please select an opponent to escape from using the select menu below."
                );

            const selectMenu = new SelectMenuBuilder()
                .setCustomId("prey-opponent-select-menu")
                .setMaxValues(1)
                .setPlaceholder("Select an opponent using this")
                .setOptions(
                    opponents.map((opponent) => ({
                        label: opponent.name,
                        value: opponent.id,
                        description: `Difficulty: ${getDifficultyLevelName(
                            opponent.difficultyLevel
                        )}`,
                    }))
                );

            const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
                selectMenu
            );

            const msg = await interaction.editReply({
                embeds: [selectEmbed],
                components: [row],
            });

            const filter = (i: StringSelectMenuInteraction) => {
                if (i.user.id !== interaction.user.id) {
                    i.reply({
                        content: "That's... not yours.",
                        ephemeral: true,
                    });
                    return false;
                }

                return true;
            };

            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                filter,
                max: 1,
            });

            collector.on("collect", async (i) => {
                await i.deferUpdate();
                const opponent = opponents.find(
                    (opponent) => opponent.id === i.values[0]
                );

                if (!opponent) {
                    await i.reply({
                        content: "Something went wrong. Please try again.",
                        ephemeral: true,
                    });
                    return;
                }

                const confirmEmbed = new EmbedBuilder()
                    .setColor(0x00ffff)
                    .setTitle("Are you sure?")
                    .setDescription(
                        `Are you sure you want to escape from ${opponent.name}? If you fail, you lose all bones that are in your stomach. If you win, you get some bones.`
                    );

                const confirmRow =
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("confirm-escape")
                            .setLabel("Yeah, let's do this!")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("cancel-escape")
                            .setLabel(
                                "No, I changed my mind, I rather not take the risk."
                            )
                            .setStyle(ButtonStyle.Danger)
                    );

                const confirmMsg = await i.editReply({
                    embeds: [confirmEmbed],
                    components: [confirmRow],
                });

                const filter = (i: ButtonInteraction) => {
                    if (i.user.id !== interaction.user.id) {
                        i.reply({
                            content: "That's... not yours.",
                            ephemeral: true,
                        });
                        return false;
                    }

                    return true;
                };

                const collector = confirmMsg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    filter,
                    max: 1,
                });

                collector.on("collect", async (i) => {
                    if (i.customId === "confirm-escape") {
                        await i.deferUpdate();

                        await escapeOpponentMinigame(
                            mainUser,
                            opponent,
                            interaction
                        );
                    } else if (i.customId === "cancel-escape") {
                        await i.deferUpdate();

                        const cancelledEmbed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle("All right, operation cancelled.")
                            .setDescription(
                                "You don't have to attempt an escape now."
                            );

                        deleteCooldown("escape", mainUser.id);

                        await i.editReply({
                            embeds: [cancelledEmbed],
                            components: [],
                        });
                    }
                });
            });

            return;
        }

        deleteCooldown("escape", mainUser.id);
        await interaction.editReply({
            content:
                "PvP is not here yet! Stay tuned for Alpha, where the PvP system will come so you can have fun eating your friends _(or escaping them, whichever you prefer)_!",
        });
    },
} as Subcommand;
