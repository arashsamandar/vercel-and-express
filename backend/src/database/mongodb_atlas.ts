import mongoose from "mongoose";


export default async function connectToMongoAtlas() {
    try {
        await mongoose.connect("mongodb+srv://arashinternet:aCowDLeEt3Gf4QWb@cluster0.t1xjibr.mongodb.net/example?retryWrites=true&w=majority&appName=Cluster0");
    } catch (error: any) {
        console.error(error);
    }
}