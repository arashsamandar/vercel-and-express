import React, { useEffect, useRef } from "react";
import "../../../assets/sass/lyrics.scss";

// fps prop is now passed in from the parent
export default function Lyrics({ svgOpacity, ip, fps }) {

    const messageRef = useRef(null);
    // Keep a ref so the setInterval closure always reads the latest fps
    const fpsRef = useRef(fps);
    useEffect(() => { fpsRef.current = fps; }, [fps]);

    // --- 1. TEXT FORMATTING ---
    const charsToHtml = (text, color = null) => {
        const style = color ? ` style="color:${color}"` : "";
        return text.split("").map((c) =>
            c === " " ? `<i${style}>&nbsp;</i>` : `<i${style}>${c}</i>`
        ).join("");
    };

    const formatLines = (lines) =>
        lines.map((segments) =>
            `<span>${segments.map(({ text, color }) => charsToHtml(text, color)).join("")}</span>`
        ).join("<br/>");

    // --- 2. CONTENT UPDATE ---
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

    // --- 3. ANIMATION ---
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
            <p ref={messageRef} className="typewriter js-typewriter">
                Loading....
            </p>
        </div>
    );
}