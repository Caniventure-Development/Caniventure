import type { SubcommandGroup } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("other")
        .setDescription("Other commands")
        .setDMPermission(false),
    testing: true,
} as SubcommandGroup;
// This will have its subcommands added by the command deployer, add more commands in the other folder
