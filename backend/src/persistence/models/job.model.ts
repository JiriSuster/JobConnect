
import * as mongoose from "mongoose";

export const Job = mongoose.model('Job', new mongoose.Schema({
    title: { type: String, required: true },
    customerEmail:{ type: String, required: true },
    companyEmail: { type: String, required: false },
    description: { type: String, required: true },
    categories: { type: [String], required: true },
    subcategories: { type: [String], required: false },
    images: { type: [Object], required: false },
    budget: { type: Number, required: false },
}));