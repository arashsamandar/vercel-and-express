import mongoose from "mongoose";
import environments from "../config/environments";

export default async function connectToMongoAtlas() {
    await mongoose.connect(environments.MONGODB_ATLAS_URL);
}