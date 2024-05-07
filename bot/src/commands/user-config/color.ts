import {
    AttachmentBuilder,
    type ChatInputCommandInteraction,
} from "discord.js";
import { Subcommand } from "../../types";
import {
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { getUserOrCreate } from "../../utils/databaseUtils";
import { hexToRgb, verifyHex } from "../../utils/helpers";
import users, { UserObject } from "../../models/users";
import { createCanvas } from "canvas";

type ColorType = "skin" | "stomach" | "acid";

/// ------------------- HELPER METHODS ------------------- \\\

function createColorBlock(color: string) {
    const width = 256;
    const height = 256;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    return canvas.toBuffer("image/png");
}

async function checkHex(
    value: string,
    interaction: ChatInputCommandInteraction
) {
    if (!verifyHex(value)) {
        const invalidHexEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`\`${value}\` is not a valid hex code!`);

        await interaction.editReply({
            embeds: [invalidHexEmbed],
        });

        return false;
    }

    return true;
}

function getBaseColorPreviewEmbed(colorName: string) {
    return new EmbedBuilder().setTitle(`Current ${colorName} Color`);
}

async function handleSkinColor(
    interaction: ChatInputCommandInteraction,
    user: UserObject,
    value?: string | null
) {
    if (!value) {
        const currentSkinColor = user.colors.skin;
        const currentSkinColorRgb = hexToRgb(currentSkinColor);

        if (!currentSkinColorRgb) {
            const failedEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    "Failed to convert current skin color hex to RGB."
                );

            await interaction.editReply({
                embeds: [failedEmbed],
            });
            return;
        }
        const attachment = new AttachmentBuilder(
            createColorBlock(currentSkinColor)
        ).setName("color.png");

        const embed = getBaseColorPreviewEmbed("Skin");
        embed
            .setColor([
                currentSkinColorRgb.red,
                currentSkinColorRgb.green,
                currentSkinColorRgb.blue,
            ])
            .setDescription(
                `Your current skin color is \`${currentSkinColor}\`, a preview of this is on the left.`
            )
            .setThumbnail("attachment://color.png");

        await interaction.editReply({
            embeds: [embed],
            files: [attachment],
        });
        return;
    }

    const isValidHex = await checkHex(value, interaction);
    if (!isValidHex) {
        return;
    }

    await users.findOneAndUpdate(
        {
            id: user.id,
        },
        {
            $set: {
                "colors.skin": value,
            },
        }
    );
    const attachment = new AttachmentBuilder(createColorBlock(value)).setName(
        "color.png"
    );

    const newSkinColorRgb = hexToRgb(value);

    if (!newSkinColorRgb) {
        const failedEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription("Failed to convert new skin color hex to RGB.");

        await interaction.editReply({
            embeds: [failedEmbed],
        });
        return;
    }

    const setEmbed = new EmbedBuilder()
        .setColor([
            newSkinColorRgb.red,
            newSkinColorRgb.green,
            newSkinColorRgb.blue,
        ])
        .setTitle("Skin Color Set!")
        .setDescription(
            "Your skin color has been changed (a preview of your new color is on the left)."
        )
        .addFields(
            {
                name: "From",
                value: user.colors.skin,
            },
            {
                name: "To",
                value,
            }
        )
        .setThumbnail("attachment://color.png");

    await interaction.editReply({
        embeds: [setEmbed],
        files: [attachment],
    });
}

async function handleStomachColor(
    interaction: ChatInputCommandInteraction,
    user: UserObject,
    value?: string | null
) {
    if (!value) {
        const currentStomachColor = user.colors.stomach;
        const currentStomachColorRgb = hexToRgb(currentStomachColor);

        if (!currentStomachColorRgb) {
            const failedEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    "Failed to convert current stomach color hex to RGB."
                );

            await interaction.editReply({
                embeds: [failedEmbed],
            });
            return;
        }

        const attachment = new AttachmentBuilder(
            createColorBlock(currentStomachColor)
        ).setName("color.png");
        const embed = getBaseColorPreviewEmbed("Stomach Walls");
        embed
            .setColor([
                currentStomachColorRgb.red,
                currentStomachColorRgb.green,
                currentStomachColorRgb.blue,
            ])
            .setDescription(
                `Your current stomach color is \`${currentStomachColor}\`, a preview of this is on the left and in the thumbnail.`
            )
            .setThumbnail("attachment://color.png");

        await interaction.editReply({
            embeds: [embed],
            files: [attachment],
        });
        return;
    }

    if (!checkHex(value, interaction)) {
        return;
    }

    await users.findOneAndUpdate(
        {
            id: user.id,
        },
        {
            $set: {
                "colors.stomach": value,
            },
        }
    );

    const newStomachColorRgb = hexToRgb(value);

    if (!newStomachColorRgb) {
        const failedEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription("Failed to convert new stomach color hex to RGB.");

        await interaction.editReply({
            embeds: [failedEmbed],
        });
        return;
    }

    const attachment = new AttachmentBuilder(createColorBlock(value)).setName(
        "color.png"
    );
    const setEmbed = new EmbedBuilder()
        .setColor([
            newStomachColorRgb.red,
            newStomachColorRgb.green,
            newStomachColorRgb.blue,
        ])
        .setTitle("Stomach Color Set!")
        .setDescription(
            "Your stomach color has been changed (a preview of your new color is on the left)."
        )
        .addFields(
            {
                name: "From",
                value: user.colors.stomach,
            },
            {
                name: "To",
                value,
            }
        )
        .setThumbnail("attachment://color.png");

    await interaction.editReply({
        embeds: [setEmbed],
        files: [attachment],
    });
}

async function handleAcidColor(
    interaction: ChatInputCommandInteraction,
    user: UserObject,
    value?: string | null
) {
    if (!value) {
        const currentAcidColor = user.colors.acid;
        const currentAcidColorRgb = hexToRgb(currentAcidColor);

        if (!currentAcidColorRgb) {
            const failedEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription(
                    "Failed to convert current acid color hex to RGB."
                );

            await interaction.editReply({
                embeds: [failedEmbed],
            });
            return;
        }

        const attachment = new AttachmentBuilder(
            createColorBlock(currentAcidColor)
        ).setName("color.png");
        const embed = getBaseColorPreviewEmbed("Stomach Acid");
        embed
            .setColor([
                currentAcidColorRgb.red,
                currentAcidColorRgb.green,
                currentAcidColorRgb.blue,
            ])
            .setDescription(
                `Your current acid color is \`${currentAcidColor}\`, a preview of this is on the left.`
            )
            .setThumbnail("attachment://color.png");

        await interaction.editReply({
            embeds: [embed],
            files: [attachment],
        });
        return;
    }

    if (!checkHex(value, interaction)) {
        return;
    }

    await users.findOneAndUpdate(
        {
            id: user.id,
        },
        {
            $set: {
                "colors.acid": value,
            },
        }
    );

    const newAcidColorRgb = hexToRgb(value);

    if (!newAcidColorRgb) {
        const failedEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription("Failed to convert new acid color hex to RGB.");

        await interaction.editReply({
            embeds: [failedEmbed],
        });
        return;
    }

    const attachment = new AttachmentBuilder(createColorBlock(value)).setName(
        "color.png"
    );
    const setEmbed = new EmbedBuilder()
        .setColor([
            newAcidColorRgb.red,
            newAcidColorRgb.green,
            newAcidColorRgb.blue,
        ])
        .setTitle("Acid Color Set!")
        .setDescription(
            "Your acid color has been changed (a preview of your new color is on the left)."
        )
        .addFields(
            {
                name: "From",
                value: user.colors.acid,
            },
            {
                name: "To",
                value,
            }
        )
        .setThumbnail("attachment://color.png");

    await interaction.editReply({
        embeds: [setEmbed],
        files: [attachment],
    });
}

/// ------------------ END HELPER METHODS ------------------- \\\

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("color")
        .setDescription("Get or set one of your colors")
        .addStringOption((option) =>
            option
                .setName("color_type")
                .setDescription("The type of color to get or set")
                .setRequired(true)
                .addChoices(
                    {
                        name: "Skin",
                        value: "skin",
                    },
                    {
                        name: "Stomach Walls",
                        value: "stomach",
                    },
                    {
                        name: "Stomach Acids",
                        value: "acid",
                    }
                )
        )
        .addStringOption((option) =>
            option
                .setName("value")
                .setDescription(
                    "The new value of color_type, if not provided, gets the current value."
                )
                .setRequired(false)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const colorType = interaction.options.getString(
            "color_type",
            true
        ) as ColorType;
        const value = interaction.options.getString("value");
        const user = await getUserOrCreate(interaction.user.id);

        switch (colorType) {
            case "skin":
                await handleSkinColor(interaction, user, value);
                break;
            case "stomach":
                await handleStomachColor(interaction, user, value);
                break;
            case "acid":
                await handleAcidColor(interaction, user, value);
                break;
        }
    },
} as Subcommand;
