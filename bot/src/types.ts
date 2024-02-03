import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import type {
    APIEmbedField,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    ClientEvents,
    SlashCommandBuilder,
} from "discord.js";

export interface SubcommandGroup {
    data: SlashCommandBuilder;
    testing?: boolean;
}

export interface Subcommand {
    data: SlashCommandSubcommandBuilder;
    extra_data?: {
        owner_only?: boolean;
        cooldown?: {
            time: number;
            message?: string;
        };
    };
    execute(interaction: ChatInputCommandInteraction): void | Promise<void>;
}

export interface Event {
    name: keyof ClientEvents;
    once?: boolean;
    execute(...args: any): void | Promise<void>;
}

export interface PageData {
    embedTitle: string;
    embedFields: APIEmbedField[];
    components?: ActionRowBuilder<ButtonBuilder>[];
}
