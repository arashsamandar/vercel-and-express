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

    if (typeof forwarded === "string") {
        ip = forwarded.split(",")[0];
    } else {
        ip = req.socket.remoteAddress; // fallback for localhost/dev
    }

    res.json({
        message: "This is the Route for getting IP address",
        latitude: 10,
        longitude: 10,
        country_name: "Nigeria",
        ip: ip,
    });

    await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_KEY}/sendMessage`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: 5665639218,
                text: `A User Saw U With IP : ${ip}`,
            }),
        }
    );
});

router.get("/newRoute", (req, res) => {
    res.json({
        message: "this is a new route",
    });
}); 


export default router;
