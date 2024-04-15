"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send("hello aarash samandar from Ts");
});
app.get('/aarash', (req, res) => {
    res.send('hello from aarash route babe');
});
app.get('/newaddress', (req, res) => {
    res.send('new address added to the Vercel arash sir');
});
