import type { SubcommandGroup } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("user-config")
        .setDescription("A group of commands"),
    testing: false,
} as SubcommandGroup;
// This will have its subcommands added by the command deployer, add more commands in the user-config folder
