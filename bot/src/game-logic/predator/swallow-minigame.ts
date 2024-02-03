import type { users, GuildsOptionsCustomOpponents } from "@prisma/client";
import type {
    ButtonInteraction,
    ChatInputCommandInteraction,
    Collection,
} from "discord.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from "@discordjs/builders";
import { ButtonStyle, ComponentType } from "discord.js";
import { prisma } from "../../utils/prismaUtils";
import {
    disableAllButtons,
    enableAllButtons,
    getRandomMilliTimeFromSecondsRange,
    wait,
} from "../../utils/helpers";

export async function swallowOpponentMinigame(
    predator: users, // User document
    prey: GuildsOptionsCustomOpponents, // Any opponent, since both the `opponents` model and `customOpponents` follow a similar structure.
    interaction: ChatInputCommandInteraction
) {
    const timeToReact =
        (5.75 / prey.difficultyLevel) *
        1 /* 1 to be replaced in Alpha with the predators' level */ *
        1000; // For collector
    let predatorWins = 3;

    function getFooter() {
        return {
            text: `Predator Score: ${predatorWins}/8 - Prey Score: ${
                8 - predatorWins
            }/8`,
        };
    }

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("All right, get ready to swallow!")
        .setDescription("Get your mouse or finger on the button below!")
        .setFooter(getFooter());

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId("swallow")
            .setLabel("SWALLOW")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
    );

    let roundLost = false;
    let roundWon = false;

    async function onEnd(
        _: Collection<string, ButtonInteraction>,
        reason: string
    ) {
        disableAllButtons(row);

        await interaction.editReply({
            embeds: [swallowEmbed],
            components: [row],
        });

        if (reason === "Win" || reason === "Pause") {
            // End gets executed when the collector.stop is called
            // If the reason is "Win", we don't need to do anything
            return;
        }

        if (roundWon) {
            return;
        }

        // Predator lost the round.
        roundLost = true;
        predatorWins--;

        if (predatorWins <= 0) {
            const loseEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("You lost!")
                .setDescription(
                    "You have failed to swallow your opponent. They escaped. Better luck next time!"
                )
                .setFooter(getFooter());

            await interaction.editReply({
                embeds: [loseEmbed],
                components: [],
            });

            // We don't need to stop the collector here, it's already stopped.
            return;
        }

        const failEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Whoopsies!")
            .setDescription(
                `You'll have to be a little faster than that! You have to react within ${(
                    timeToReact / 1000
                ).toFixed(2)} seconds.`
            )
            .setFooter(getFooter());

        await interaction.editReply({ embeds: [failEmbed], components: [row] });

        await wait(getRandomMilliTimeFromSecondsRange(3, 5));

        await interaction.editReply({
            embeds: [embed.setFooter(getFooter())],
            components: [row],
        });

        await wait(getRandomMilliTimeFromSecondsRange(5, 10));

        roundLost = false;

        enableAllButtons(row);

        collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter,
            time: timeToReact,
        });

        // Re-assign the events, since this is a new collector
        collector.on("collect", onCollect);
        collector.on("end", onEnd);

        await interaction.editReply({
            embeds: [swallowEmbed.setFooter(getFooter())],
            components: [row],
        });
    }

    async function onCollect(i: ButtonInteraction) {
        if (i.customId === "swallow") {
            await i.deferUpdate();

            collector.stop("Pause");

            if (roundLost) {
                // Hopefully this fixes the double decrement bug.
                return;
            }

            roundWon = true;

            // Predator won that round.
            predatorWins++;

            if (predatorWins >= 8) {
                const winEmbed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle("You won!")
                    .setDescription(
                        "You have successfully swallowed your opponent!"
                    )
                    .setFooter(getFooter());

                await interaction.editReply({
                    embeds: [winEmbed],
                    components: [],
                });

                collector.stop("Win");

                predator.peopleInStomach.push({
                    amountOfPeopleInStomach: 0n,
                    bonesInStomach: BigInt(prey.bonesInStomach),
                    id: prey.id,
                    isAi: true,
                });

                await prisma.users.update({
                    where: {
                        id: predator.id,
                    },
                    data: {
                        peopleInStomach: {
                            set: predator.peopleInStomach,
                        },
                    },
                });
                return;
            }

            const successEmbed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("Nice one!")
                .setDescription(
                    "Your prey is one step closer to your stomach! Keep it up!"
                )
                .setFooter(getFooter());

            disableAllButtons(row);

            await interaction.editReply({
                embeds: [successEmbed],
                components: [row],
            });

            await wait(getRandomMilliTimeFromSecondsRange(3, 5));

            await interaction.editReply({
                embeds: [embed.setFooter(getFooter())],
                components: [row],
            });

            await wait(getRandomMilliTimeFromSecondsRange(5, 10));

            roundWon = false;

            enableAllButtons(row);

            await interaction.editReply({
                embeds: [swallowEmbed.setFooter(getFooter())],
                components: [row],
            });

            collector = msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter,
                time: timeToReact,
            });

            // Re-assign the events, since this is a new collector
            collector.on("collect", onCollect);
            collector.on("end", onEnd);
        }
    }

    await interaction.editReply({ embeds: [embed], components: [row] });

    await wait(getRandomMilliTimeFromSecondsRange(5, 10));

    const swallowEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("SWALLOW NOW!")
        .setDescription("CLICK THE BUTTON BELOW TO SWALLOW!")
        .setFooter(getFooter());

    enableAllButtons(row);

    const msg = await interaction.editReply({
        embeds: [swallowEmbed],
        components: [row],
    });

    const filter = async (i: ButtonInteraction) => {
        if (i.user.id !== interaction.user.id) {
            await i.reply({
                content: "That's... not your button.",
                ephemeral: true,
            });
            return false;
        }

        return true;
    };

    let collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
        time: timeToReact,
    });

    collector.on("collect", onCollect);
    collector.on("end", onEnd);
}
