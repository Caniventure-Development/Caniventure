import { Subcommand } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("block-ip")
        .setDescription("A very cool command part of the owner-only group"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply("Command executed");
    }
} as Subcommand
