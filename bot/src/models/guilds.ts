import { Schema, model } from "mongoose";

export interface GuildObject {
    id: string;
    logChannelId: string | null;
    options: {
        languageFilterOn: boolean;
        customOpponents: {
            bonesInStomach: number;
            difficultyLevel: number;
            id: string;
            name: string;
        }[];
        peopleAllowedToChangeSettings: string[];
    };
}

const guildSchema = new Schema<GuildObject>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    logChannelId: {
        type: String,
        default: null,
    },
    options: {
        languageFilterOn: {
            type: Boolean,
            default: false,
        },
        customOpponents: {
            type: [
                {
                    bonesInStomach: {
                        type: Number,
                        default: 0,
                    },
                    difficultyLevel: {
                        type: Number,
                        default: 1,
                    },
                    id: {
                        type: String,
                        required: true,
                    },
                    name: {
                        type: String,
                        required: true,
                    },
                },
            ],
            default: [],
        },
        peopleAllowedToChangeSettings: {
            type: [String],
            default: [],
        },
    },
});

export default model<GuildObject>("guilds", guildSchema);
