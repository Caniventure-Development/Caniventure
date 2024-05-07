import axios from "axios";

export function getDiscordOAuthUrl(
    clientId: string,
    scopes: string[],
    permissions: number | null = null,
    guildId: string | null = null,
): string {
    let url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&scope=${scopes.join("%20")}`;

    if (permissions) {
        url += `&permissions=${permissions}`;
    }

    if (guildId) {
        url += `&guild_id=${guildId}`;
    }

    return url;
}

export async function getUserFromDiscord(id: string) {
    const res = await axios.get(`https://discord.com/api/v10/users/${id}`, {
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`,
        },
    });

    return res;
}

export const wait: (timeMs: number) => Promise<void> = (timeMs: number) =>
    new Promise((resolve) => setTimeout(resolve, timeMs));
