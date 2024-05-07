import { Schema, model } from "mongoose";
import type { UserObject } from "./users";

export interface AllianceObject {
    id: string;
    name: string;
    description: string;
    icon: string | null;
    ownerId: string;
    members: UserObject[];
}

const allianceSchema = new Schema<AllianceObject>({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: null,
    },
    ownerId: {
        type: String,
        required: true,
    },
    members: {
        type: Array<Object> as any,
        default: [],
    },
});

export default model<AllianceObject>("alliances", allianceSchema);
