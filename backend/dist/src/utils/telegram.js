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
exports.sendTelegramMessage = sendTelegramMessage;
exports.sendTelegramMessageToAll = sendTelegramMessageToAll;
const axios_1 = __importDefault(require("axios"));
const BOT_TOKEN = process.env.TELE_KEY;
function sendTelegramMessage(message, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        yield axios_1.default.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
        });
    });
}
function sendTelegramMessageToAll(message_1) {
    return __awaiter(this, arguments, void 0, function* (message, chatIds = []) {
        const results = yield Promise.allSettled(chatIds.map(id => sendTelegramMessage(message, id)));
        const failed = results.filter(r => r.status === "rejected");
        if (failed.length) {
            console.error("Some Telegram sends failed:", failed);
        }
        // throw only if ALL failed, so one bad chatId doesn't break the whole thing
        if (failed.length === results.length) {
            throw new Error("All Telegram sends failed");
        }
    });
}
