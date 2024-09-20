"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMongodbUsers = exports.main = void 0;
const mongodb_1 = require("mongodb");
const client = new mongodb_1.MongoClient("mongodb://localhost:27017/arashDatabase");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Connected to MongoDB");
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.main = main;
function readMongodbUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = client.db('arashDatabase');
        const usersCollection = db.collection('users');
        const users = usersCollection.find({}).toArray();
        return users;
    });
}
exports.readMongodbUsers = readMongodbUsers;
