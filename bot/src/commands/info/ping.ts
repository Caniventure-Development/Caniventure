import { Subcommand } from "../../types";
import {
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("ping")
        .setDescription("Check if the bot is online"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const msg = await interaction.reply({
            content: "Pinging... Please wait...",
            fetchReply: true,
        });

        const latency = msg.createdTimestamp - interaction.createdTimestamp;
        const heartbeat = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder().setTitle("Pong!").addFields([
            {
                name: "Latency (round-trip)",
                value: `${latency}ms`,
                inline: true,
            },
            {
                name: "Heartbeat",
                value: `${heartbeat}ms`,
                inline: true,
            },
        ]);

        await interaction.editReply({ embeds: [embed] });
    },
} as Subcommand;
