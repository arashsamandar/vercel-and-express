"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForDbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const waitForDbConnection = (maxRetries = 3, retryInterval = 1000) => {
    return new Promise((resolve, reject) => {
        let retries = 0;
        const checkConnection = () => {
            if (mongoose_1.default.connection.readyState === 1) {
                resolve();
            }
            else if (retries >= maxRetries) {
                reject(new Error('Max retries reached. Database connection failed.'));
            }
            else {
                retries++;
                setTimeout(checkConnection, retryInterval);
            }
        };
        checkConnection();
    });
};
exports.waitForDbConnection = waitForDbConnection;
