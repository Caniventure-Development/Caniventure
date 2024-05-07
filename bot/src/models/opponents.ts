import { Schema, model } from "mongoose";

export interface OpponentObject {
    id: string;
    name: string;
    difficultyLevel: number;
    bonesInStomach: number;
}

const opponentSchema = new Schema<OpponentObject>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    difficultyLevel: {
        type: Number,
        required: true,
    },
    bonesInStomach: {
        type: Number,
        default: 0,
    },
});

export default model<OpponentObject>("opponents", opponentSchema);
