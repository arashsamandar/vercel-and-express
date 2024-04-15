"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(3000, () => console.log('application ready to use'));
app.get('/', (req, res) => {
    res.send("hello aarash samandar from Ts");
});
app.get('/aarash', (req, res) => {
    res.send('Adding Only Neccesary Routes Like AARASH Route');
});
app.get('/testing', (req, res) => {
    res.json({ name: "arash", family: "samandar" }).send();
});
