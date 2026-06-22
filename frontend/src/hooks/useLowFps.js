import { useEffect, useRef, useState } from "react";

export default function useLowFps(threshold = 30) {
    const [fps, setFps]           = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [runCount, setRunCount]  = useState(0);
    const modalShownRef            = useRef(false);

    useEffect(() => {
        let frameId;
        let frameCount   = 0;
        let startTime    = performance.now();
        let measurements = [];
        const initTime   = performance.now();
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
                    const rounded = Math.round(avgFps);

                    setFps(rounded);
                    setRunCount(prev => prev + 1);

                    // Show the modal exactly once
                    if (avgFps < threshold && !modalShownRef.current) {
                        modalShownRef.current = true;
                        setShowModal(true);
                    }
                    return;
                }
            }
            frameId = requestAnimationFrame(measure);
        };

        frameId = requestAnimationFrame(measure);
        return () => cancelAnimationFrame(frameId);
    }, [runCount]);

    return {
        fps,
        showModal,
        closeModal: () => setShowModal(false),
    };
}