#!/usr/bin/bash
cwd=$(pwd)

if [[ $1 == "--command" ]]; then
    read -p "What is the name of the command? " name
    read -p "What group does the command belong to? " group

    if [[ -z $group ]]; then
        echo "Group cannot be empty"
        exit 1
    fi

    if [[ -z $name ]]; then
        echo "Name cannot be empty"
        exit 1
    fi

    group=$(echo "$group" | tr '[:upper:]' '[:lower:]')

    # Check if group exists (in src/commands)
    if [[ ! -d "$cwd/src/commands/$group" ]]; then
        echo "Group does not exist"
        exit 1
    fi

    # Check if command already exists
    if [[ -f "$cwd/src/commands/$group/$name.ts" ]]; then
        echo "Command already exists"
        exit 1
    fi

    # Create command
    cat <<EOF > "$cwd/src/commands/$group/$name.ts"
import { Subcommand } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("$name")
        .setDescription("A very cool command part of the $group group"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply("Command executed");
    }
} as Subcommand
EOF

    echo "Command created"
fi

if [[ $1 == "--group" ]]; then
    read -p "What is the name of the group? " name
    name=$(echo "$name" | tr '[:upper:]' '[:lower:]')

    if [[ -z $name ]]; then
        echo "Name cannot be empty"
        exit 1
    fi

    if [[ -d "$cwd/src/commands/$name" ]]; then
        echo "Group already exists"
        exit 1
    fi

    # Create group definition file
    cat <<EOF > "$cwd/src/commands/$name.ts"
import type { SubcommandGroup } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("$name")
        .setDescription("A group of commands"),
    testing: false,
} as SubcommandGroup;
// This will have its subcommands added by the command deployer, add more commands in the $name folder
EOF

    # Create directory for subcommands
    mkdir -p "$cwd/src/commands/$name"

    # Create base subcommand definition file
    cat <<EOF > "$cwd/src/commands/$name/cool-command.ts"
import { Subcommand } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import type { ChatInputCommandInteraction } from "discord.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("cool-command")
        .setDescription("A very cool command"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply("Command executed");
    }
} as Subcommand;
EOF

    echo "Group created"
fi
