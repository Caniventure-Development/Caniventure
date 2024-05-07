import { Schema, model } from "mongoose";

export interface ReviewObject {
    userId: string;
    stars: number;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;
}

const reviewSchema = new Schema<ReviewObject>({
    userId: {
        type: String,
        required: true,
    },
    stars: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: null,
    },
});

export default model<ReviewObject>("reviews", reviewSchema);
