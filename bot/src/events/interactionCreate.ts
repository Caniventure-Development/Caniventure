import type { Event } from "../types";
import type { BaseInteraction } from "discord.js";
import { Events } from "discord.js";

import { commands, cooldowns } from "../handlers/commandHandler";

export default {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: BaseInteraction) => {
        if (interaction.user.bot) return;

        if (interaction.isChatInputCommand()) {
            const command = commands.get(
                interaction.options.getSubcommand(true)
            );

            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                );
                return;
            }

            if (command.extra_data?.owner_only) {
                if (interaction.user.id !== process.env.OWNER_ID) {
                    // Silently return if not owner
                    return;
                }
            }

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Map());
            }

            try {
                const now = Date.now();
                const timestamps = cooldowns.get(command.data.name)!;
                const cooldownAmount =
                    (command.extra_data?.cooldown?.time || 3) * 1000;

                if (timestamps.has(interaction.user.id)) {
                    const expirationTime =
                        timestamps.get(interaction.user.id)! + cooldownAmount;

                    if (now < expirationTime) {
                        const expiredTimestamp = Math.round(
                            expirationTime / 1000
                        );
                        const expiredDate = new Date(expiredTimestamp);

                        return await interaction.reply({
                            content:
                                command.extra_data?.cooldown?.message?.replace(
                                    "{time}",
                                    `${expiredDate.getMinutes()}:${expiredDate.getSeconds()}` +
                                        ""
                                ) ||
                                `Woah, woah, woah! Slow down there friend! You can use this command again in ${expiredDate.getMinutes()}:${expiredDate.getSeconds()} seconds.`,
                            ephemeral: true,
                        });
                    }
                }

                timestamps.set(interaction.user.id, now);
                setTimeout(
                    () => timestamps.delete(interaction.user.id),
                    cooldownAmount
                );

                await command.execute(interaction);
            } catch (error) {
                console.error(error);

                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({
                        content:
                            "There was an error while executing this command!",
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content:
                            "There was an error while executing this command!",
                        ephemeral: true,
                    });
                }
            }
        }
    },
} as Event;
