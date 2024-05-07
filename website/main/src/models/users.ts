import { Schema, model } from "mongoose";
import { AllianceObject } from "./alliances";
import { ReviewObject } from "./reviews";

export interface UserBadge {
    name: string;
    description: string;
    ownedIcon: string;
    unownedIcon: string;
    owned: boolean;
}

export interface PersonInUserStomach {
    amountOfPeopleInStomach: number;
    bonesInStomach: number;
    id: string;
    isAi: boolean;
}

export interface UserObject {
    id: string;
    alliance: AllianceObject | null;
    badges: UserBadge[];
    colors: {
        [key: string]: string;
    };
    blacklisted: boolean;
    items: {
        predator: {
            [key: string]: number;
        };
        prey: {
            [key: string]: number;
        };
    };
    bonesCollected: number;
    bonesInStomach: number;
    inHardcore: boolean;
    inStomach: boolean;
    languageFilterOn: boolean;
    level: number;
    peopleInStomach: PersonInUserStomach[];
    pvpOn: boolean;
    reportBanned: boolean;
    stomachCapacity: number;
    reviews: ReviewObject[];
}

const userSchema = new Schema<UserObject>({
    id: {
        type: String,
        required: true,
        unique: true,
        _id: true,
    },
    alliance: {
        type: Object,
        default: null,
    },
    badges: {
        type: [Object],
        default: [
            {
                description:
                    "Made a contribution to Caniventures' source code!",
                name: "Contributor",
                owned: true,
                ownedIcon: "<:contributor:1202066143762980914>",
                unownedIcon: "<:contributor_unowned:1204785900710662164>",
            },
            {
                name: "Moderator",
                description:
                    "This user moderates Caniventures' user to ensure fair play!",
                owned: true,
                ownedIcon: "<:moderator:1202066144744185886>",
                unownedIcon: "<:moderator_unowned:1204785895526367232>",
            },
            {
                name: "Owner",
                description:
                    "This user is the owner of Caniventure, the highest of priority!",
                owned: true,
                ownedIcon: "<:owner:1202066142005575701>",
                unownedIcon: "<:owner_unowned:1204785898949181451>",
            },
        ],
    },
    colors: {
        type: Object,
        default: {
            skin: "#000000",
            acid: "#336933",
            stomach: "#ffc0cb",
        },
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },
    items: {
        predator: {
            type: Object,
            default: {
                acid: 0,
            },
        },
        prey: {
            type: Object,
            default: {
                poison: 0,
                lube: 0,
            },
        },
    },
    bonesCollected: {
        type: Number,
        default: 0,
    },
    bonesInStomach: {
        type: Number,
        default: 0,
    },
    inHardcore: {
        type: Boolean,
        default: false,
    },
    inStomach: {
        type: Boolean,
        default: false,
    },
    languageFilterOn: {
        type: Boolean,
        default: false,
    },
    level: {
        type: Number,
        default: 1,
    },
    peopleInStomach: {
        type: [Object],
        default: [],
    },
    pvpOn: {
        type: Boolean,
        default: false,
    },
    reportBanned: {
        type: Boolean,
        default: false,
    },
    stomachCapacity: {
        type: Number,
        default: 1,
    },
    reviews: {
        type: [Object],
        default: [],
    },
});

export default model<UserObject>("users", userSchema);
