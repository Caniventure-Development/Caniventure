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
import {
    disableAllButtons,
    enableAllButtons,
    getRandomMilliTimeFromSecondsRange,
    wait,
} from "../../utils/helpers";
import { users } from "../../models/";
import type { UserObject } from "../../models/users";
import type { OpponentObject } from "../../models/opponents";

export async function escapeOpponentMinigame(
    prey: UserObject,
    predator: OpponentObject,
    interaction: ChatInputCommandInteraction
) {
    // This may be rewritten into a unique minigame sometime in the future.
    const timeToReact =
        (5.75 / predator.difficultyLevel) *
        1 /* 1 to be replaced in Alpha with the predators' level */ *
        1000; // For collector
    let preyWins = 3;

    function getFooter() {
        return {
            text: `Prey Score: ${preyWins}/8 - Predator Score: ${
                8 - preyWins
            }/8`,
        };
    }

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("All right, get ready to struggle your way out!")
        .setDescription("Get your mouse or finger on the button below!")
        .setFooter(getFooter());

    const customId = "struggle";

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(customId)
            .setLabel("STRUGGLE")
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
            embeds: [struggleEmbed],
            components: [row],
        });

        if (reason === "Win" || reason === "Pause") {
            // End gets executed when the collector.stop is called
            // If the reason is "Win" or "Pause", we don't need to do anything
            return;
        }

        if (roundWon) {
            // Prey already won, we don't need to do anything
            // Hopefully this prevents a bug I call "The Double Decrement Bug".
            return;
        }

        // Prey lost the round.
        roundLost = true;
        preyWins--;

        if (preyWins <= 0) {
            // Prey lost the game.
            const loseEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("You lost!")
                .setDescription(
                    "You have failed to escape your opponent. They digested you and you lost all the bones that were inside of you. Better luck next time!\n\n**Protip: Extract your bones before attempting an escape by using `/predator extract`! Maybe you won't lose everything!**"
                )
                .setFooter(getFooter());

            await interaction.editReply({
                embeds: [loseEmbed],
                components: [],
            });

            await users.findOneAndUpdate(
                {
                    id: prey.id,
                },
                {
                    $set: {
                        bonesInStomach: 0,
                    },
                }
            );

            // We don't need to stop the collector here, it's already stopped.
            return;
        }

        const failEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Whoopsies!")
            .setDescription(
                `You'll have to be a little faster than that or you'll just be a skeleton in your opponents' stomach! You have to react within ${(
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
            embeds: [struggleEmbed.setFooter(getFooter())],
            components: [row],
        });
    }

    async function onCollect(i: ButtonInteraction) {
        if (i.customId === customId) {
            await i.deferUpdate();

            collector.stop("Pause");

            if (roundLost) {
                // Hopefully this fixes the double decrement bug.
                return;
            }

            roundWon = true;

            // Prey won that round.
            preyWins++;

            if (preyWins >= 8) {
                const bonesEarned = Math.ceil(
                    Math.random() * (206 * predator.difficultyLevel)
                );
                const winEmbed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle("You won!")
                    .setDescription(
                        `You have successfully escaped your opponent and weren't digested, you were also able to escape with **${bonesEarned}** bones from your opponents' stomach!`
                    )
                    .setFooter(getFooter());

                await interaction.editReply({
                    embeds: [winEmbed],
                    components: [],
                });

                collector.stop("Win");

                await users.findOneAndUpdate(
                    {
                        id: prey.id,
                    },
                    {
                        $inc: {
                            bonesCollected: bonesEarned,
                        },
                    }
                );

                return;
            }

            const successEmbed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("Nice one!")
                .setDescription("You're one step closer from seeing freedom!")
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
                embeds: [struggleEmbed.setFooter(getFooter())],
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

    const struggleEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("STRUGGLE NOW!")
        .setDescription("CLICK THE BUTTON BELOW TO STRUGGLE!")
        .setFooter(getFooter());

    enableAllButtons(row);

    const msg = await interaction.editReply({
        embeds: [struggleEmbed],
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
