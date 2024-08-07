"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const startTime = Date.now();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(3000, () => console.log('application ready to use'));
app.get('/api/helloarash', (req, res) => {
    res.send(`took ${Date.now() - startTime}ms to respond`);
});
app.get('/api/helloarash2', (req, res) => {
    res.send('hello arash this one works On Two 2');
});
