import "dotenv/config";

import { Client, GatewayIntentBits, Partials } from "discord.js";
import mongoose from "mongoose";

import setupEvents from "./handlers/eventHandler";

// Environment Variable Checks
if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
if (!process.env.BOT_TOKEN && !process.env.DEV_BOT_TOKEN)
    throw new Error("Missing BOT_TOKEN/DEV_BOT_TOKEN");

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: true,
    },
    partials: [Partials.User, Partials.GuildMember, Partials.Channel],
});
mongoose.connect(process.env.DATABASE_URL);

setupEvents(client);

export const TOKEN = process.env.DEV_BOT_TOKEN; // Development
// export const TOKEN = process.env.BOT_TOKEN; // Production

client.login(TOKEN);
