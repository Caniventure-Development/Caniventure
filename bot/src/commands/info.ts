import { SlashCommandBuilder } from "@discordjs/builders";
import type { SubcommandGroup } from "../types";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Info commands")
        .setDMPermission(false),
    testing: true,
} as SubcommandGroup;
// This will have its subcommands added by the command deployer, add more commands in the info folder
