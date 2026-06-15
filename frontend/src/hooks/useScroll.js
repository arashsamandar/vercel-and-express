import {useEffect, useState} from "react";

export default function useScroll() {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = 400; // The scroll distance (pixels) where you want the animation to finish

            // Calculate a value between 1 and 0 based on scroll position
            // This is deterministic and will never "drift"
            const newOpacity = Math.max(0, 1 - scrollY / threshold);
            setOpacity(newOpacity);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return opacity;
}


// export function mobileAdjustCallBack(){
//     return useCallback((node) => {
//         if(!node) return;
//         if(node.id === 'lyrics'){
//             isMobile ? node.classList.add('max-w-[70vw]') : node.classList.add('max-w-[48vw]');
//         }
//         if(node.id === 'svgImage')
//             isMobile ? node.classList.add('mt-44') : node.classList.remove('mt-44');
//     },[]);
// }