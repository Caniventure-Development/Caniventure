import type { SubcommandGroup } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("prey")
        .setDescription(
            "Commands for all prey that want to test their escaping skill or just fight predators"
        )
        .setDMPermission(false),
    testing: false,
} as SubcommandGroup;
// This will have its subcommands added by the command deployer, add more commands in the prey folder
