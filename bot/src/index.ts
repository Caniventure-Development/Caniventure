import "dotenv/config";

import { Client, GatewayIntentBits, Partials } from "discord.js";

import setupEvents from "./handlers/eventHandler";

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: true,
    },
    partials: [Partials.User, Partials.GuildMember, Partials.Channel],
});

setupEvents(client);

export const TOKEN = process.env.DEV_BOT_TOKEN; // Development
// export const TOKEN = process.env.BOT_TOKEN; // Production

client.login(TOKEN);
