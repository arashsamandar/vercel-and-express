"use strict";
// check to see vercel functionality
// lets check whether changes persist or not
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(3000, () => console.log('hello arash server is up'));

app.get('/', (req, res) => {
    res.send('hello arash and welcome to your new web application');
});

app.get('/aarash',(req,res)=>{
	res.send('welcome to route aarash');
});
