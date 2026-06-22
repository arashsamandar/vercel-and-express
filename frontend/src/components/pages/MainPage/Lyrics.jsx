import React, { useEffect, useRef, useState } from "react";
import "../../../assets/sass/lyrics.scss";

export default function Lyrics({ svgOpacity, ip }) {
    const [isLowEnd, setIsLowEnd] = useState(false);
    const messageRef = useRef(null);
    const [runCount, setRunCount] = useState(0);
    const fpsRef = useRef(0);

    // --- 1. FPS MONITORING ---
    useEffect(() => {
        let frameId;
        let frameCount = 0;
        let startTime = performance.now();
        let measurements = [];
        const initTime = performance.now();
        const MONITOR_DURATION = 3000;

        const measure = (time) => {
            frameCount++;
            const elapsed = time - startTime;
            if (elapsed >= 500) {
                const currentFps = (frameCount / elapsed) * 1000;
                measurements.push(currentFps);
                startTime = time;
                frameCount = 0;

                const totalTime = performance.now() - initTime;
                if (totalTime > MONITOR_DURATION) {
                    const avgFps = measurements.reduce((a, b) => a + b, 0) / measurements.length;
                    fpsRef.current = Math.round(avgFps);
                    setRunCount(prev => prev + 1);
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

    // --- 2. TEXT FORMATTING LOGIC ---

    // Converts a string into <i> character tags, with an optional color per character
    const charsToHtml = (text, color = null) => {
        const style = color ? ` style="color:${color}"` : "";
        return text.split("").map((c) =>
            c === " " ? `<i${style}>&nbsp;</i>` : `<i${style}>${c}</i>`
        ).join("");
    };

    // Each line is an array of segments: [{ text, color? }, ...]
    // This lets different parts of the same line have different colors
    const formatLines = (lines) => {
        return lines.map((segments) => {
            const chars = segments
                .map(({ text, color }) => charsToHtml(text, color))
                .join("");
            return `<span>${chars}</span>`;
        }).join("<br/>");
    };

    // --- 3. CONTENT UPDATE LOGIC ---
    const updateContent = () => {
        if (!ip || !ip.ip || !messageRef.current) return;

        const currentFps = fpsRef.current;
        const fpsText = currentFps > 0 ? `${currentFps} Frame/Sec` : "Measuring Fps ...";
        const isLowFps = currentFps > 0 && currentFps < 30; // only color red when we have a real reading

        const cores = typeof window.navigator.hardwareConcurrency !== "undefined"
            ? window.navigator.hardwareConcurrency + "Core" : "";
        const memory = typeof window.navigator.deviceMemory !== "undefined"
            ? window.navigator.deviceMemory + "GB" : "";
        const locationText = ip.country_name
            ? ip.country_name + " " + (ip.city || "") : null;

        // Build each line as an array of { text, color } segments
        const lines = [];

        // Line 1: IP address
        lines.push([{ text: ip.ip }]);

        // Line 2 (optional): Location
        if (locationText) lines.push([{ text: locationText }]);

        // Line 3: FPS in red if below 30, then cores & memory in default color
        lines.push([
            { text: fpsText, color: isLowFps ? "red" : null },
            { text: ` ${cores} ${memory}` },
        ]);

        // Line 4: Welcome
        lines.push([{ text: "Welcome " }]);

        messageRef.current.innerHTML = formatLines(lines);
    };

    // --- 4. ANIMATION FLOW LOGIC ---
    const replayAnimation = () => {
        const el = messageRef.current;
        if (!el) return;

        updateContent();

        el.classList.remove("animate");
        requestAnimationFrame(() => {
            void el.offsetHeight; // Force reflow
            requestAnimationFrame(() => {
                el.classList.add("animate");
            });
        });
    };

    // Triggered only when IP data first arrives
    useEffect(() => {
        if (ip && ip.ip) {
            updateContent();
            messageRef.current?.classList.add("animate");
        }
    }, [ip]);

    // The 5-second loop
    useEffect(() => {
        const interval = setInterval(() => {
            replayAnimation();
        }, 5000);
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