"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// app.use(express.static('public'));
app.listen(3000, () => console.log('application ready to use'));
// app.get('/',(req,res)=>{
// 	res.sendFile('index.html',{root:__dirname + '\\public'})
// });
app.get('/api/helloarash', (req, res) => {
    res.send('hello arash this one works ?? really ??');
});
