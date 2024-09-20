"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_atlas_1 = __importDefault(require("../database/mongodb_atlas"));
const router = express_1.default.Router();
router.get('/checkmyerror', (req, res, next) => {
    next(new Error('some error message i sent for you'));
});
router.get('/checkRoute', (req, res) => {
    res.json({
        message: 'this is a test route arash',
    });
});
router.get('/getMongodb', (req, res, next) => {
    try {
        (0, mongodb_atlas_1.default)();
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
