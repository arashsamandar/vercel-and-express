"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testRoutes_1 = __importDefault(require("./src/routes/testRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/tests/', testRoutes_1.default);
app.get('/api/testApplication', (req, res) => {
    res.send('Application Is Working Gracefully Arash');
});
app.use((error, req, res, next) => {
    res.status(500).json({
        message: error.message,
        stack_trace: error.stack
    });
});
app.listen(3000, () => console.log('application ready to use'));
