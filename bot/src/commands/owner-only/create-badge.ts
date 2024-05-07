import { Subcommand } from "../../types";
import {
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";
import { guilds, users } from "../../models/";
import emojis from "../../emojis";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("create-badge")
        .setDescription("Creates a new badge (owner only)")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("The name of the badge")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("description")
                .setDescription("The description of the badge")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("owned_emoji")
                .setDescription(
                    "The raw emoji string for the badge if it is owned (example: <:stomach:1196638815608131664>)"
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("unowned_emoji")
                .setDescription(
                    "The raw emoji string for the badge if it is not owned (example: <:stomach:1196638815608131664>)"
                )
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("is_owned")
                .setDescription(
                    "Whether the badge is owned or not by default (defaults to false)"
                )
                .setRequired(false)
        ),
    extra_data: {
        owner_only: true,
    },
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true }); // Just so people can't see that I'M making a cool new badge.

        const name = interaction.options.getString("name", true);
        const description = interaction.options.getString("description", true);
        const ownedEmoji = interaction.options.getString("owned_emoji", true);
        const unownedEmoji = interaction.options.getString(
            "unowned_emoji",
            true
        );
        const isOwned = interaction.options.getBoolean("is_owned") ?? false;

        // Confirm that ownedEmoji and unownedEmoji are raw emoji strings
        const rawEmojiRegex = /<:(\w+):(\d+)>/g;
        const ownedEmojiMatch = ownedEmoji.match(rawEmojiRegex);
        const unownedEmojiMatch = unownedEmoji.match(rawEmojiRegex);

        if (
            !ownedEmojiMatch ||
            !unownedEmojiMatch ||
            ownedEmojiMatch.length !== 1 ||
            unownedEmojiMatch.length !== 1
        ) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("Hmm... that wasn't right...")
                .setDescription(
                    "Please make sure that both `owned_emoji` and `unowned_emoji` are raw emoji strings (example: <:stomach:1196638815608131664>)"
                );

            await interaction.editReply({
                embeds: [embed],
            });
            return;
        }

        // Add the badge to the array of badges
        emojis.BADGES.push({
            name,
            description,
            ownedIcon: ownedEmojiMatch[0],
            unownedIcon: unownedEmojiMatch[0],
            owned: isOwned,
        });

        // Update each entry in the database
        const allUsers = await users.find();

        for (const user of allUsers) {
            await users.findOneAndUpdate(
                {
                    id: user.id,
                },
                {
                    $push: {
                        badges: {
                            name,
                            description,
                            ownedIcon: ownedEmoji,
                            unownedIcon: unownedEmoji,
                            owned: isOwned,
                        },
                    },
                }
            );
        }

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Badge created!")
            .setDescription(
                `Created badge **${name}** with description "**${description}**"`
            );

        await interaction.editReply({
            embeds: [embed],
        });
    },
} as Subcommand;
