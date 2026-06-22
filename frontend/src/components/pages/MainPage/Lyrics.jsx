import React, { useEffect, useRef, useState } from "react";
import "../../../assets/sass/lyrics.scss";

// ─── Keyframe animations injected once ───────────────────────────────────────
const KEYFRAMES = `
    @keyframes overlayFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes modalJump {
        0%   { transform: scale(0.35); opacity: 0; }
        60%  { transform: scale(1.08); opacity: 1; }
        78%  { transform: scale(0.96); }
        90%  { transform: scale(1.03); }
        100% { transform: scale(1);    opacity: 1; }
    }
    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 0 0 0   rgba(255, 70, 70, 0.55); }
        50%      { box-shadow: 0 0 0 12px rgba(255, 70, 70, 0);    }
    }
`;

// ─── Low-FPS Modal ────────────────────────────────────────────────────────────
function LowFpsModal({ fps, onClose }) {
    return (
        <>
            <style>{KEYFRAMES}</style>

            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.75)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "overlayFadeIn 0.3s ease forwards",
                    fontFamily: "inherit",
                }}
            >
                {/* Card */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: "rgba(10, 10, 18, 0.93)",
                        border: "1px solid rgba(255, 80, 80, 0.22)",
                        borderRadius: "24px",
                        padding: "44px 40px 38px",
                        maxWidth: "400px",
                        width: "calc(100% - 48px)",
                        backdropFilter: "blur(30px)",
                        WebkitBackdropFilter: "blur(30px)",
                        boxShadow: [
                            "0 32px 72px rgba(0, 0, 0, 0.75)",
                            "0 0 0 1px rgba(255, 255, 255, 0.04)",
                            "inset 0 1px 0 rgba(255, 255, 255, 0.07)",
                        ].join(", "),
                        animation: "modalJump 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                        textAlign: "center",
                        color: "#fff",
                    }}
                >
                    {/* Warning icon */}
                    <div style={{
                        width: 68,
                        height: 68,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ff3b3b, #ff8c00)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 26px",
                        animation: "iconGlow 2s ease-in-out infinite",
                        flexShrink: 0,
                    }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 3L2 21h20L12 3z"
                                stroke="#fff"
                                strokeWidth="2"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            <line x1="12" y1="9" x2="12" y2="14"
                                  stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                            <circle cx="12" cy="17.5" r="1.2" fill="#fff" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h2 style={{
                        margin: "0 0 10px",
                        fontSize: "22px",
                        fontWeight: 700,
                        letterSpacing: "-0.3px",
                        color: "#fff",
                    }}>
                        Performance Warning
                    </h2>

                    {/* Accent divider */}
                    <div style={{
                        width: 42,
                        height: 2,
                        background: "linear-gradient(90deg, #ff3b3b, #ff8c00)",
                        borderRadius: 2,
                        margin: "0 auto 22px",
                    }} />

                    {/* FPS message */}
                    <p style={{
                        margin: "0 0 12px",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        color: "rgba(255, 255, 255, 0.75)",
                    }}>
                        Your device is rendering at{" "}
                        <span style={{ color: "#ff5050", fontWeight: 700, fontSize: "16px" }}>
                            {fps} FPS
                        </span>
                        , below the recommended{" "}
                        <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                            30 FPS
                        </span>{" "}
                        threshold.
                    </p>

                    {/* Suggestion */}
                    <p style={{
                        margin: "0 0 34px",
                        fontSize: "13.5px",
                        lineHeight: 1.75,
                        color: "rgba(255, 255, 255, 0.4)",
                    }}>
                        This experience is resource-intensive. Try closing background apps
                        or switching to a higher-performance device for smoother visuals.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={onClose}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.82";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        style={{
                            background: "linear-gradient(135deg, #ff3b3b, #ff8c00)",
                            border: "none",
                            borderRadius: "12px",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: 600,
                            letterSpacing: "0.2px",
                            padding: "14px 44px",
                            transition: "opacity 0.2s ease, transform 0.2s ease",
                            outline: "none",
                        }}
                    >
                        Got it
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Lyrics({ svgOpacity, ip }) {
    const [isLowEnd, setIsLowEnd]   = useState(false);
    const [showModal, setShowModal] = useState(false);
    const messageRef                = useRef(null);
    const [runCount, setRunCount]   = useState(0);
    const fpsRef                    = useRef(0);
    const modalShownRef             = useRef(false); // show the modal only once

    // --- 1. FPS MONITORING ---
    useEffect(() => {
        let frameId;
        let frameCount = 0;
        let startTime  = performance.now();
        let measurements = [];
        const initTime = performance.now();
        const MONITOR_DURATION = 3000;

        const measure = (time) => {
            frameCount++;
            const elapsed = time - startTime;

            if (elapsed >= 500) {
                const currentFps = (frameCount / elapsed) * 1000;
                measurements.push(currentFps);
                startTime  = time;
                frameCount = 0;

                const totalTime = performance.now() - initTime;
                if (totalTime > MONITOR_DURATION) {
                    const avgFps = measurements.reduce((a, b) => a + b, 0) / measurements.length;
                    fpsRef.current = Math.round(avgFps);
                    setRunCount(prev => prev + 1);

                    // Show modal once if FPS < 30
                    if (avgFps < 30 && !modalShownRef.current) {
                        modalShownRef.current = true;
                        setShowModal(true);
                    }
                    // Mark device as low-end if FPS < 25
                    if (avgFps < 25 && !isLowEnd) {
                        setIsLowEnd(true);
                    }
                    return;
                }
            }
            frameId = requestAnimationFrame(measure);
        };

        frameId = requestAnimationFrame(measure);
        return () => cancelAnimationFrame(frameId);
    }, [runCount]);

    // --- 2. TEXT FORMATTING ---
    const charsToHtml = (text, color = null) => {
        const style = color ? ` style="color:${color}"` : "";
        return text.split("").map((c) =>
            c === " " ? `<i${style}>&nbsp;</i>` : `<i${style}>${c}</i>`
        ).join("");
    };

    const formatLines = (lines) =>
        lines.map((segments) => {
            const chars = segments
                .map(({ text, color }) => charsToHtml(text, color))
                .join("");
            return `<span>${chars}</span>`;
        }).join("<br/>");

    // --- 3. CONTENT UPDATE ---
    const updateContent = () => {
        if (!ip || !ip.ip || !messageRef.current) return;

        const currentFps = fpsRef.current;
        const fpsText    = currentFps > 0 ? `${currentFps} Frame/Sec` : "Measuring Fps ...";
        const isLowFps   = currentFps > 0 && currentFps < 30;

        const cores    = typeof window.navigator.hardwareConcurrency !== "undefined"
            ? window.navigator.hardwareConcurrency + "Core" : "";
        const memory   = typeof window.navigator.deviceMemory !== "undefined"
            ? window.navigator.deviceMemory + "GB" : "";
        const locationText = ip.country_name
            ? ip.country_name + " " + (ip.city || "") : null;

        const lines = [];
        lines.push([{ text: ip.ip }]);
        if (locationText) lines.push([{ text: locationText }]);
        lines.push([
            { text: fpsText, color: isLowFps ? "#ff5050" : null },
            { text: ` ${cores} ${memory}` },
        ]);
        lines.push([{ text: "Welcome " }]);

        messageRef.current.innerHTML = formatLines(lines);
    };

    // --- 4. ANIMATION ---
    const replayAnimation = () => {
        const el = messageRef.current;
        if (!el) return;
        updateContent();
        el.classList.remove("animate");
        requestAnimationFrame(() => {
            void el.offsetHeight;
            requestAnimationFrame(() => el.classList.add("animate"));
        });
    };

    useEffect(() => {
        if (ip && ip.ip) {
            updateContent();
            messageRef.current?.classList.add("animate");
        }
    }, [ip]);

    useEffect(() => {
        const interval = setInterval(replayAnimation, 5000);
        return () => clearInterval(interval);
    }, [ip]);

    return (
        <div className="component select-none mt-0">

            {showModal && (
                <LowFpsModal
                    fps={fpsRef.current}
                    onClose={() => setShowModal(false)}
                />
            )}

            <p ref={messageRef} className="typewriter js-typewriter">
                Loading....
            </p>

        </div>
    );
}