import type { Client } from "discord.js";
import fs from "fs";
import type { Event } from "../types";

export default function (client: Client) {
    const eventFiles = fs
        .readdirSync("./src/events")
        .filter((file) => file.endsWith(".ts"));

    for (const file of eventFiles) {
        const event: Event = require(`../events/${file}`).default;

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}
