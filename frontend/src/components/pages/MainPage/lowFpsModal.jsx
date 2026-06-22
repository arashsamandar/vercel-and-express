import React from "react";

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
    @keyframes iconPulse {
        0%, 100% { box-shadow: 0 0 0 0   rgba(255, 70, 70, 0.55); }
        50%      { box-shadow: 0 0 0 14px rgba(255, 70, 70, 0);    }
    }
`;

export default function LowFpsModal({ fps, onClose }) {
    return (
        <>
            <style>{KEYFRAMES}</style>

            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position:        "fixed",
                    inset:           0,
                    zIndex:          99999,          // above everything
                    background:      "rgba(0,0,0,0.72)",
                    backdropFilter:  "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    animation:       "overlayFadeIn 0.3s ease forwards",
                    fontFamily:      "inherit",
                }}
            >
                {/* Card */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background:    "rgba(10, 10, 18, 0.94)",
                        border:        "1px solid rgba(255, 80, 80, 0.2)",
                        borderRadius:  "24px",
                        padding:       "44px 40px 38px",
                        maxWidth:      "400px",
                        width:         "calc(100% - 48px)",
                        backdropFilter: "blur(30px)",
                        WebkitBackdropFilter: "blur(30px)",
                        boxShadow: [
                            "0 32px 72px rgba(0,0,0,0.75)",
                            "0 0 0 1px rgba(255,255,255,0.04)",
                            "inset 0 1px 0 rgba(255,255,255,0.07)",
                        ].join(", "),
                        animation:  "modalJump 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                        textAlign:  "center",
                        color:      "#fff",
                    }}
                >
                    {/* Warning icon */}
                    <div style={{
                        width:        68,
                        height:       68,
                        borderRadius: "50%",
                        background:   "linear-gradient(135deg, #ff3b3b, #ff8c00)",
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                        margin:       "0 auto 26px",
                        animation:    "iconPulse 2s ease-in-out infinite",
                    }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 3L2 21h20L12 3z"
                                stroke="#fff" strokeWidth="2"
                                strokeLinejoin="round" strokeLinecap="round"
                            />
                            <line x1="12" y1="9"  x2="12" y2="14"
                                  stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                            <circle cx="12" cy="17.5" r="1.2" fill="#fff"/>
                        </svg>
                    </div>

                    {/* Title */}
                    <h2 style={{
                        margin:        "0 0 10px",
                        fontSize:      "22px",
                        fontWeight:    700,
                        letterSpacing: "-0.3px",
                    }}>
                        Performance Warning
                    </h2>

                    {/* Divider */}
                    <div style={{
                        width:        42,
                        height:       2,
                        background:   "linear-gradient(90deg, #ff3b3b, #ff8c00)",
                        borderRadius: 2,
                        margin:       "0 auto 22px",
                    }}/>

                    {/* FPS info */}
                    <p style={{
                        margin:     "0 0 12px",
                        fontSize:   "15px",
                        lineHeight: 1.7,
                        color:      "rgba(255,255,255,0.75)",
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
                        margin:     "0 0 34px",
                        fontSize:   "13.5px",
                        lineHeight: 1.75,
                        color:      "rgba(255,255,255,0.38)",
                    }}>
                        This experience is resource-intensive. Try closing background
                        apps or switching to a higher-performance device for smoother visuals.
                    </p>

                    {/* Button */}
                    <button
                        onClick={onClose}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity   = "0.82";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity   = "1";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        style={{
                            background:     "linear-gradient(135deg, #ff3b3b, #ff8c00)",
                            border:         "none",
                            borderRadius:   "12px",
                            color:          "#fff",
                            cursor:         "pointer",
                            fontSize:       "15px",
                            fontWeight:     600,
                            letterSpacing:  "0.2px",
                            padding:        "14px 44px",
                            transition:     "opacity 0.2s ease, transform 0.2s ease",
                            outline:        "none",
                        }}
                    >
                        Got it
                    </button>
                </div>
            </div>
        </>
    );
}