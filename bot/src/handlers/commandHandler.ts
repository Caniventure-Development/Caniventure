// Needed type imports
import type {
    Client,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import type { Subcommand, SubcommandGroup } from "../types";

// Imports
import { REST, Routes } from "discord.js";
import fs from "fs";
import { TOKEN } from "../";
import colors from "picocolors";

export const commands = new Map<string, Subcommand>();
export const cooldowns = new Map<string, Map<string, number>>();

export function registerCommands(client: Client) {
    // Used for pushing to the API, don't delete or touch either of these
    const globalCommandsToPush: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
        [];
    const guildCommandsToPush: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
        [];

    // Register subcommand groups
    const subcommandGroupFiles = fs
        .readdirSync("./src/commands")
        .filter((file) => file.endsWith(".ts"));

    for (const file of subcommandGroupFiles) {
        const subcommandGroupData: SubcommandGroup =
            require(`../commands/${file}`).default;
        const subcommandGroup = subcommandGroupData.data;

        const subcommandFiles = fs
            .readdirSync(`./src/commands/${subcommandGroup.name}`)
            .filter((file) => file.endsWith(".ts"));

        if (subcommandFiles.length === 0) {
            console.log(
                colors.yellow(
                    `No commands in ${subcommandGroup.name}, skipping.`
                )
            );
            continue;
        }

        for (const file of subcommandFiles) {
            const subcommand: Subcommand =
                require(`../commands/${subcommandGroup.name}/${file}`).default;
            commands.set(subcommand.data.name, subcommand);
            subcommandGroup.addSubcommand(subcommand.data);
        }

        if (!subcommandGroupData.testing) {
            globalCommandsToPush.push(subcommandGroup.toJSON());
        } else {
            guildCommandsToPush.push(subcommandGroup.toJSON());
        }
    }

    const rest = new REST({ version: "10" }).setToken(TOKEN!);

    try {
        // Push global commands, we separated them to make it easier to test
        rest.put(Routes.applicationCommands(client.user!.id), {
            body: globalCommandsToPush,
        });
        console.log(
            colors.green(
                `Successfully registered ${globalCommandsToPush.length} global commands to Discord.`
            )
        );
    } catch (error) {
        console.log(
            colors.red(
                "Failed to register global commands. Please use the error below to debug."
            )
        );
        console.error(error);
    }

    try {
        // Push guild commands
        rest.put(
            Routes.applicationGuildCommands(
                client.user!.id,
                process.env.TEST_GUILD_ID!
            ),
            {
                body: guildCommandsToPush,
            }
        );

        console.log(
            colors.green(
                `Successfully registered ${
                    guildCommandsToPush.length
                } guild commands to guild ID ${process.env.TEST_GUILD_ID!}.`
            )
        );
    } catch (error) {
        console.log(
            colors.red(
                "Failed to register guild commands. Please use the error below to debug."
            )
        );
        console.error(error);
    }
}
