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
exports.waitForDbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_atlas_1 = __importDefault(require("../database/mongodb-atlas"));
const waitForDbConnection = (maxRetries = 3, retryInterval = 1000) => {
    return new Promise((resolve, reject) => {
        let retries = 0;
        const checkConnection = () => __awaiter(void 0, void 0, void 0, function* () {
            if (mongoose_1.default.connection.readyState === 1) {
                resolve();
            }
            else if (retries >= maxRetries) {
                reject(new Error('Max retries reached. Database connection failed.'));
            }
            else {
                yield (0, mongodb_atlas_1.default)();
                retries++;
                setTimeout(checkConnection, retryInterval);
            }
        });
        checkConnection();
    });
};
exports.waitForDbConnection = waitForDbConnection;
