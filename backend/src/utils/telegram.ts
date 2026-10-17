import axios from "axios";

const BOT_TOKEN = process.env.TELE_KEY;

async function sendTelegramMessage(message: any, chatId: any) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
    });
}

async function sendTelegramMessageToAll(message: any, chatIds: number[] = []) {
    const results = await Promise.allSettled(
        chatIds.map(id => sendTelegramMessage(message, id))
    );

    const failed = results.filter(r => r.status === "rejected");
    if (failed.length) {
        console.error("Some Telegram sends failed:", failed);
    }

    // throw only if ALL failed, so one bad chatId doesn't break the whole thing
    if (failed.length === results.length) {
        throw new Error("All Telegram sends failed");
    }
}

export {
    sendTelegramMessage,
    sendTelegramMessageToAll
}