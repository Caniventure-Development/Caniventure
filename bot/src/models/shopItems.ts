// This'll be used in Alpha!
import { Schema, model } from "mongoose";

export interface ShopItemObject {
    id: string;
    name: string;
    description: string;
    price: number;
    icon: string;
    sellable: boolean;
    type: "predator" | "prey";
}

const shopItemSchema = new Schema<ShopItemObject>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    icon: {
        type: String,
        default: null,
    },
    sellable: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String,
        enum: ["predator", "prey"],
        required: true,
    },
});

export default model<ShopItemObject>("shopItems", shopItemSchema);
