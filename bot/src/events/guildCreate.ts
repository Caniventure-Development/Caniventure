import type { Event } from "../types";
import type { Guild } from "discord.js";
import {
    ChannelType,
    Events,
    TextChannel,
    PermissionsBitField,
} from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

export default {
    name: Events.GuildCreate,
    once: false,
    execute: async (guild: Guild) => {
        const channels = await guild.channels.fetch();
        const textChannels = channels.filter(
            (channel) => channel!.type === ChannelType.GuildText
        );
        const botHellChannel = textChannels.find(
            (channel) => channel!.name === "bot-hell"
        );

        if (!botHellChannel) return;
        if (!(botHellChannel instanceof TextChannel)) return;

        const helloEmbed = new EmbedBuilder()
            .setColor(0x00ffff)
            .setTitle(`Hello! I am ${guild.client.user.username}!`)
            .setDescription(
                `Thank you for adding ${guild.client.user.username}: The Caniballistic Discord Bot to your Discord server **${guild.name}**!`
            );
        const whatNextEmbed = new EmbedBuilder()
            .setColor(0x00ffff)
            .setTitle("What's next?")
            .setDescription(
                `View [here](https://caniventure.vercel.app/getting-started?guild_id=${guild.id}) to view how to get started and some good next steps.`
            )
            .setFooter({
                text: "Please note that the bot is in Pre-Alpha so bugs may occur, if you see any bugs, please report them in any of the links in the next embed below.",
            })
            .setURL(
                `https://caniventure.vercel.app/getting-started?guild_id=${guild.id}`
            );
        const linksEmbed = new EmbedBuilder()
            .setColor(0x00ffff)
            .setTitle("Links")
            .addFields(
                {
                    name: "Main Links",
                    value: "**[Invite Link](https://caniventure.vercel.app/invite)**\n**[Website](https://caniventure.vercel.app)**",
                    inline: true,
                },
                {
                    name: "Bug Reporting Links",
                    value: "**[GitHub](https://github.com/Caniventure-Development/Caniventure/issues)**\n**[Discord](https://caniventure.vercel.app/discord)**",
                    inline: true,
                }
            );

        if (
            !botHellChannel
                .permissionsFor(guild.client.user)
                ?.has(PermissionsBitField.Flags.SendMessages)
        )
            return;
        await botHellChannel.send({
            embeds: [helloEmbed, whatNextEmbed, linksEmbed],
        });
    },
} as Event;
