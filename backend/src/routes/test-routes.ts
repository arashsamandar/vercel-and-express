import express from "express";
import {sendTelegramMessage, sendTelegramMessageToAll} from "../utils/telegram";
const router = express.Router();

router.get('/checkmyerror', (req, res, next)=>{
   next(new Error('some error message i sent for you'));
});

router.get('/checkRoute', (req, res)=>{
    res.json({
        message: 'this is a test route arash',
    })
});

router.get("/getIp", async (req, res) => {
    const forwarded = req.headers["x-forwarded-for"];
    let ip;
    let message = "";
    if (typeof forwarded === "string") {
        ip = forwarded.split(",")[0];
    } else {
        ip = req.socket.remoteAddress; // fallback for localhost/dev
    }


    try{
        await fetch(
            `https://api.telegram.org/bot${process.env.TELE_KEY}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: 5665639218,
                    text: `A User Saw U With IP: ${ip}`,
                }),
            }
        );
        message = "Sent was Successful Arash";
    }catch(error){
        message = "Telegram request failed " + error;
    }


    res.json({
        message: message,
        latitude: 10,
        longitude: 10,
        country_name: "Nigeria",
        ip: ip,
    });
});

router.get("/newRoute", (req, res) => {
    res.json({
        message: "this is a new route",
    });
});

// ---------------------------------------- IP Sniff Routes -------------------------------------------

function getPostClientIp(req: any) {
    const forwarded = req.headers["x-forwarded-for"];
    return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress;
}

const TELEGRAM_CHAT_IDS = [
    process.env.TELEGRAM_CHAT_ID_1,
    process.env.TELEGRAM_CHAT_ID_2,
].filter(Boolean);

router.post("/getYourIp", async (req, res) => {
    const ip = getPostClientIp(req);

    const { timeInfo, languageInfo } = req.body ?? {};

    if (
        !timeInfo ||
        typeof timeInfo.visitorTimeZone !== "string" ||
        !languageInfo ||
        typeof languageInfo.language !== "string"
    ) {
        return res.status(400).json({
            error: "Invalid request body",
        });
    }

    const message = `
🎉 <b>یک بازدیدکننده‌ی خاص وارد شد</b>

🌐 <b>آی‌پی:</b> ${ip}

🕒 <b>اطلاعات زمانی</b>
منطقه‌ی زمانی بازدیدکننده: ${timeInfo.visitorTimeZone}
اختلاف زمانی با تهران (دقیقه): ${timeInfo.difference}

🗣 <b>اطلاعات زبان</b>
زبان: ${languageInfo.language}
زبان‌های تنظیم‌شده: ${
        Array.isArray(languageInfo.languages)
            ? languageInfo.languages.join("، ")
            : "در دسترس نیست"
    }
لوکال: ${languageInfo.locale ?? "در دسترس نیست"}
`;

    try {
        await sendTelegramMessageToAll(message, [5665639218]);

        return res.json({
            success: true,
            message: "Sent successfully",
        });
    } catch (error) {
        console.error("Telegram request failed:", error);

        return res.status(500).json({
            success: false,
            message: "Telegram request failed",
        });
    }
});

function getClientIp(req: any) {
    const forwarded = req.headers["x-forwarded-for"];
    return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress;
}

router.get("/phoneEntered", async (req, res) => {
    const ip = getClientIp(req);
    const phone = typeof req.query.phone === "string" ? req.query.phone.trim() : "";

    let message;
    try {
        await sendTelegramMessageToAll(`A Special User Entered Phone: ${phone} — IP: ${ip}`, [5665639218]);
        message = "Sent was Successful Arash";
    } catch (error) {
        message = "Telegram request failed " + error;
    }

    res.json({ ip, message });
});


export default router;
