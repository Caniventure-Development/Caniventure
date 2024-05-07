import type { SubcommandGroup } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("predator")
        .setDescription("Commands for all the predators looking to get full")
        .setDMPermission(false),
    testing: true,
} as SubcommandGroup;
// This will have its subcommands added by the command deployer, add more commands in the predator folder
