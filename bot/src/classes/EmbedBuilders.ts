import { EmbedBuilder } from "@discordjs/builders";

/**
 * Contains multiple static functions that return premade embeds
 */
export default class EmbedBuilders {
    public static errorEmbed(
        description: string,
        title: string | null = "Error",
        color: number = 0xff0000
    ) {
        return new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description);
    }

    public static successEmbed(
        description: string,
        title: string | null = "Success",
        color: number = 0x00ff00
    ) {
        return new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description);
    }
}
