import { useState, useEffect } from "react";

export default function useScreenSize() {
    const isClient = typeof window !== "undefined";

    function getWidth() {
        return isClient ? window.innerWidth : 0;
    }

    const [width, setWidth] = useState(getWidth);

    useEffect(() => {
        if (!isClient) return;

        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", onResize, { passive: true });

        // in case layout changed before listener attached
        onResize();

        return () => window.removeEventListener("resize", onResize);
    }, [isClient]);

    return width;
}
