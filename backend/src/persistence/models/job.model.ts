
import * as mongoose from "mongoose";

export const Job = mongoose.model('Job', new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: [String], required: true },
    subcategories: { type: [String], required: false },
    images: { type: [Object], required: false },
    budget: { type: Number, required: false },
}));