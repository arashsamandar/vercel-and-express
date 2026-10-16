import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  CONFIG — replace these with your own values                        */
/* ------------------------------------------------------------------ */
const BRAND = "CryptoX";
const LOGO_URL = ""; // <-- put your bitcoin image link here. Empty = built-in fallback icon
const API = {
    sendCode: "https://your-api.com/auth/send-code", // POST { phone }
    verifyCode: "https://your-api.com/auth/verify-code", // POST { phone, code }
    pageVisit: "https://your-api.com/analytics/visit", // POST on every visit
};
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

    const phoneValid = /^\d{10,11}$/.test(phone);
    const fullPhone = "+98" + phone.replace(/^0/, "");

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

    /* ---- 1) fetch on EVERY visit (ref guard stops the React StrictMode double-call in dev) ---- */
    useEffect(() => {
        if (visitLogged.current) return;
        visitLogged.current = true;

        fetch(API.pageVisit, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                page: window.location.pathname,
                referrer: document.referrer || null,
                userAgent: navigator.userAgent,
                visitedAt: new Date().toISOString(),
            }),
            keepalive: true,
        }).catch(() => {
            /* analytics must never break the page */
        });
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
                    <h1 id="lg-title" className="lg-title">ورود</h1>
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
                        <li><ShieldIcon />ما تلفن شما را ذخیره یا به کسی ارسال نمیکنیم</li>
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
  height:92px;
  background:linear-gradient(135deg,#7c3aed 0%,#a21caf 55%,#6d28d9 100%);
  box-shadow:0 14px 44px -8px rgba(168,85,247,.7), 0 34px 90px -30px rgba(124,58,237,.9);
}
.lg-logo{
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
.lg-title{margin:0 0 6px;font-size:1.75rem;font-weight:700}
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
  .lg-phone-row{flex-direction:column-reverse;flex-wrap:nowrap}
  .lg-field{flex:0 0 auto;width:100%}
  .lg-btn-send{flex:0 0 auto;width:100%}
  .lg-otp{gap:9px}
  .lg-otp-box{width:56px;height:64px}
}

/* respect reduced motion */
@media (prefers-reduced-motion:reduce){
  .lg-root,.lg-orb,.lg-otp.is-shaking,.lg-dialog,.lg-overlay,.lg-toast{animation:none}
}
`;