import { Subcommand } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("digest")
        .setDescription("Start digesting your prey to win their bones"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply("Coming soon!");
    },
} as Subcommand;
