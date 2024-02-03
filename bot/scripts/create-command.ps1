$cwd = Get-Location | Select-Object -ExpandProperty Path

if ($args[0] -eq "--command") {
    $name = Read-Host -Prompt "What is the name of the command?"
    $group = Read-Host -Prompt "What group does the command belong to?"

    if ($group -eq "") {
        Write-Host "Group cannot be empty"
        exit 1
    }

    if ($name -eq "") {
        Write-Host "Name cannot be empty"
        exit 1
    }

    $group = $group.ToLower()

    # Check if group exists (in src/commands)

    if (!(Test-Path -Path "$cwd/src/commands/$group")) {
        Write-Host "Group does not exist"
        exit 1
    }

    # Check if command already exists

    if (Test-Path -Path "$cwd/src/commands/$group/$name.ts") {
        Write-Host "Command already exists"
        exit 1
    }

    # Create command

    $commandText = @"
import { Subcommand } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import type { ChatInputCommandInteraction } from "discord.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("$name")
        .setDescription("A very cool command part of the $group group"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply("Command executed");
    }
} as Subcommand

"@

    New-Item -Path "$cwd/src/commands/$group" -Name "$name.ts" -ItemType "file" -Value $commandText

    Write-Host "Command created"
}

if ($args[0] -eq "--group") {
    $name = Read-Host -Prompt "What is the name of the group?"
    $name = $name.ToLower()

    if ($name -eq "") {
        Write-Host "Name cannot be empty"
        exit 1
    }

    if (Test-Path -Path "$cwd/src/commands/$name") {
        Write-Host "Group already exists"
        exit 1
    }

    $subcommandGroupDefinition = @"
import type { SubcommandGroup } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("$name")
        .setDescription("A group of commands"),
    testing: false,
} as SubcommandGroup;
// This will have its subcommands added by the command deployer, add more commands in the $name folder

"@

    $baseSubcommandDefinition = @"
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

"@

    New-Item -Path "$cwd/src/commands" -Name "$name.ts" -ItemType "file" -Value $subcommandGroupDefinition
    New-Item -Path "$cwd/src/commands" -Name "$name" -ItemType "directory"
    New-Item -Path "$cwd/src/commands/$name" -Name "cool-command.ts" -ItemType "file" -Value $baseSubcommandDefinition

    Write-Host "Group created"
}
