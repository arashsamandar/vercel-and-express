import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/arashDatabase");
export async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
    }
}

export async function readMongodbUsers(){
    const db = client.db('arashDatabase');
    const usersCollection = db.collection('users');
    const users = usersCollection.find({}).toArray();
    return users;
}