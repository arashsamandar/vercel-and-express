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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const error_handling_1 = require("../utils/error-handling");
const mongodb_atlas_middleware_1 = __importDefault(require("../middlewares/mongodb-atlas.middleware"));
const mongoRouter = express_1.default.Router();
mongoRouter.get('/someurl', (req, res) => {
    res.send('database routes');
});
mongoRouter.get('/getMongodb', mongodb_atlas_middleware_1.default, (0, error_handling_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb+srv://arashinternet:aCowDLeEt3Gf4QWb@cluster0.t1xjibr.mongodb.net/example?retryWrites=true&w=majority&appName=Cluster0");
    res.json({
        message: 'connection was a success',
    });
})));
exports.default = mongoRouter;
