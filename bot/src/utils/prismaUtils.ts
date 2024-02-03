import { GuildsOptionsCustomOpponents, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function getUser(id: string) {
    return await prisma.users.findFirst({
        where: {
            id,
        },
    });
}

export async function getUserOrCreate(id: string) {
    let user = await prisma.users.findFirst({
        where: {
            id,
        },
    });

    if (!user) {
        user = await prisma.users.create({
            data: {
                id,
                badges: {},
                colors: {},
                items: {},
            },
        });
    }

    return user;
}

export async function getGuild(id: string) {
    return await prisma.guilds.findFirst({
        where: {
            id,
        },
    });
}

export async function createGuild(id: string) {
    return await prisma.guilds.create({
        data: {
            id,
            options: {
                customOpponents: [],
                languageFilterOn: false,
                peopleAllowedToChangeSettings: [],
            },
        },
    });
}

/**
 * Returns all items from the Opponents collection.
 * @returns All items from the Opponents collection.
 * @remarks
 * This function does not get custom opponents, use `getAllOpponents` instead for that.
 */
export async function getOpponents() {
    return await prisma.opponents.findMany();
}

/**
 * Gets all opponents from the database, including custom ones from `guildId` if it exists.
 * @param guildId The guild ID to use when looking for custom opponents.
 */
export async function getAllOpponents(
    guildId: string
): Promise<GuildsOptionsCustomOpponents[]> {
    let guild = await getGuild(guildId);
    const opponents: GuildsOptionsCustomOpponents[] = [];

    const opponentsFromDb = await prisma.opponents.findMany();

    opponents.push(...opponentsFromDb);

    if (guild) {
        opponents.push(...guild.options.customOpponents);
    }

    return opponents;
}
