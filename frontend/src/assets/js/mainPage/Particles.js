import { useEffect, useRef } from "react";

export default function useInitParticles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        // Spawn the worker
        const worker = new Worker(
            new URL('./particle.worker.js', import.meta.url),
            { type: 'module' }
        );

        // transferControlToOffscreen() hands the canvas to the worker
        // After this, the main thread can no longer draw to this canvas
        const offscreen = canvas.transferControlToOffscreen();

        worker.postMessage(
            { type: 'init', canvas: offscreen, width: canvas.clientWidth, height: canvas.clientHeight },
            [offscreen]  // ← second argument: "transferables" — moves ownership, no copy made
        );

        // Mouse and resize events must stay here (DOM access)
        // We just forward the relevant data to the worker
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            worker.postMessage({ type: 'mousemove', x: e.clientX - rect.left, y: e.clientY - rect.top });
        };

        const handleMouseLeave = () => {
            worker.postMessage({ type: 'mouseleave' });
        };

        const handleResize = () => {
            worker.postMessage({ type: 'resize', width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        return () => {
            worker.postMessage({ type: 'stop' });
            worker.terminate();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return canvasRef;
}