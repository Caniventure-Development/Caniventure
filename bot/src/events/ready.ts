import type { Event } from "../types";
import type { Client } from "discord.js";

import { registerCommands } from "../handlers/commandHandler";
import { ActivityType, Events } from "discord.js";
import emojis from "../emojis";
import { getUserOrCreate } from "../utils/databaseUtils";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        const clientUser = client.user!;
        console.log(`Ready! Logged in as ${clientUser.tag}`);

        clientUser.setActivity("the predators and prey", {
            type: ActivityType.Watching,
        });

        registerCommands(client);

        // Set up our badges
        const owner = await getUserOrCreate(process.env.OWNER_ID!);

        emojis.BADGES = owner.badges;
    },
} as Event;
