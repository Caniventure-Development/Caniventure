import type { Event } from "../types";

import { registerCommands } from "../handlers/commandHandler";
import { ActivityType, Events } from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const clientUser = client.user!;
        console.log(`Ready! Logged in as ${clientUser.tag}`);

        clientUser.setActivity("the predators and prey", {
            type: ActivityType.Watching,
        });

        registerCommands(client);
    },
} as Event;
