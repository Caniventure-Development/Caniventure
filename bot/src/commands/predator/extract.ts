import { Subcommand } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("extract")
        .setDescription("Extract the bones from your digested prey!"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply("Coming soon!");
    },
} as Subcommand;
