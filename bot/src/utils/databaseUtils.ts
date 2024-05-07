import { users, guilds, opponents, reviews } from "../models/";

export async function getUser(id: string) {
    return await users.findOne({
        id,
    });
}

export async function getUserOrCreate(id: string) {
    let user = await getUser(id);

    if (!user) {
        user = await users.create({
            id,
        });
        user.save();
    }

    return user;
}

export async function getGuild(id: string) {
    return await guilds.findOne({
        id,
    });
}

export async function createGuild(id: string) {
    const data = await guilds.create({
        id,
        options: {
            customOpponents: [],
            languageFilterOn: false,
            peopleAllowedToChangeSettings: [],
        },
    });

    data.save();

    return data;
}

/**
 * Returns all items from the Opponents collection.
 * @returns All items from the Opponents collection.
 * @remarks
 * This function does not get custom opponents, use `getAllOpponents` instead for that.
 */
export async function getOpponents() {
    return await opponents.find();
}

/**
 * Gets all opponents from the database, including custom ones from `guildId` if it exists.
 * @param guildId The guild ID to use when looking for custom opponents.
 */
export async function getAllOpponents(guildId: string): Promise<
    {
        id: string;
        name: string;
        difficultyLevel: number;
        bonesInStomach: number;
    }[]
> {
    let guild = await getGuild(guildId);
    const opponentsArr: {
        id: string;
        name: string;
        difficultyLevel: number;
        bonesInStomach: number;
    }[] = [];

    const opponentsFromDb = await opponents.find();

    opponentsArr.push(...opponentsFromDb);

    if (guild) {
        opponentsArr.push(...guild.options.customOpponents);
    }

    // Sort by difficulty level ascending
    opponentsArr.sort((a, b) => a.difficultyLevel - b.difficultyLevel);

    return opponentsArr;
}

export async function getAllReviews() {
    return await reviews.find();
}

export async function getReviews(userId: string) {
    return await reviews.find({
        userId,
    });
}
