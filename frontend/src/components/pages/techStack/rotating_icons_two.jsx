import React, { useEffect, useRef } from 'react';

const Rotating_Icons_Two = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const isMobile = window.innerWidth < 600;

        const ALL_ICONS = [
            { img: 'https://cdn.simpleicons.org/react/61DAFB',       name: 'React'       },
            { img: 'https://cdn.simpleicons.org/javascript/F7DF1E',   name: 'JavaScript'  },
            { img: 'https://cdn.simpleicons.org/css/1572B6',          name: 'CSS'         },
            { img: 'https://cdn.simpleicons.org/html5/E34F26',        name: 'HTML'        },
            { img: 'https://cdn.simpleicons.org/nodedotjs/339933',    name: 'Node.js'     },
            { img: 'https://cdn.simpleicons.org/laravel/FF2D20',      name: 'Laravel'     },
            { img: 'https://cdn.simpleicons.org/git/F05032',          name: 'Git'         },
            { img: 'https://cdn.simpleicons.org/docker/2496ED',       name: 'Docker'      },
            { img: 'https://cdn.simpleicons.org/supabase/3ECF8E',     name: 'Supabase'    },
            { img: 'https://cdn.simpleicons.org/postgresql/4169E1',   name: 'PostgreSQL'  },
            { img: 'https://cdn.simpleicons.org/typescript/3178C6',   name: 'TypeScript'  },
            { img: 'https://cdn.simpleicons.org/mongodb/47A248',      name: 'MongoDB'     },
            { img: 'https://cdn.simpleicons.org/nextdotjs/FFFFFF',    name: 'Next.js'     },
            { img: 'https://cdn.simpleicons.org/php/777BB4',          name: 'PHP'         },
            { img: 'https://cdn.simpleicons.org/firebase/FFCA28',     name: 'Firebase'    },
        ];

        const container = containerRef.current;
        const radius    = isMobile ? 130 : 260;

        // ── State ─────────────────────────────────────────────────────────────
        let rotX = 0, rotY = 0;
        let offsetX = 0, offsetY = 0;
        let targetOffsetX = 0, targetOffsetY = 0;
        let isHovered = false;

        // ── Build elements & pre-compute static sphere coords ─────────────────
        ALL_ICONS.forEach((icon, i) => {
            const phi   = Math.acos(1 - 2 * (i + 0.5) / ALL_ICONS.length);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;

            const el = document.createElement('div');
            el.className = 'icon-item';
            el.innerHTML = `
                <div class="icon-content">
                    <img src="${icon.img}" alt="${icon.name}" class="icon-image" />
                    <span class="icon-label">${icon.name}</span>
                </div>`;
            container.appendChild(el);

            itemsRef.current.push({
                el,
                x0:    radius * Math.sin(phi) * Math.cos(theta),
                y0:    radius * Math.cos(phi),
                z0:    radius * Math.sin(phi) * Math.sin(theta),
                lastZ: -1,
            });
        });

        // ── Cache container rect; refresh only on resize ──────────────────────
        let rect = container.getBoundingClientRect();
        const ro = new ResizeObserver(() => { rect = container.getBoundingClientRect(); });
        ro.observe(container);

        // ── Interaction handlers (Mouse & Touch) ──────────────────────────────
        const updateOffset = (clientX, clientY) => {
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const base = Math.min(rect.width, rect.height) / 2;
            targetOffsetY = ((clientX - cx) / base) * 1.2;
            targetOffsetX = ((clientY - cy) / base) * 1.2;
        };

        // Desktop
        const handleMouseMove = (e) => updateOffset(e.clientX, e.clientY);
        const handleMouseEnter = () => { isHovered = true; };

        // Mobile (Touch)
        const handleTouchStart = (e) => {
            isHovered = true;
            if (e.touches.length > 0) {
                updateOffset(e.touches[0].clientX, e.touches[0].clientY);
            }
        };
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                updateOffset(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        // Shared Leave Logic (resumes rotation)
        const handleLeave = () => {
            isHovered = false;
            rotX += offsetX;
            rotY += offsetY;
            offsetX = offsetY = targetOffsetX = targetOffsetY = 0;
        };

        container.addEventListener('mousemove',  handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleLeave);

        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove',  handleTouchMove, { passive: true });
        container.addEventListener('touchend',   handleLeave);
        container.addEventListener('touchcancel', handleLeave);

        // ── Animation loop — rAF + timestamp throttle ─────────────────────────
        const TARGET_FPS = isMobile ? 30 : 60;
        const FRAME_MS   = 1000 / TARGET_FPS;
        let lastTime = 0;
        let animId;

        const animate = (ts) => {
            animId = requestAnimationFrame(animate);
            if (ts - lastTime < FRAME_MS) return;

            const elapsed = Math.min(ts - lastTime, 100);
            lastTime = ts;

            const t = elapsed / (1000 / 60);

            if (!isHovered) {
                rotY += 0.008 * t;
                rotX += 0.003 * t;
            }

            const lerpFactor = 1 - Math.pow(0.95, t);
            offsetX += (targetOffsetX - offsetX) * lerpFactor;
            offsetY += (targetOffsetY - offsetY) * lerpFactor;

            const rx = rotX + offsetX;
            const ry = rotY + offsetY;

            const cosRx = Math.cos(rx), sinRx = Math.sin(rx);
            const cosRy = Math.cos(ry), sinRy = Math.sin(ry);

            itemsRef.current.forEach((item) => {
                const { el, x0, y0, z0 } = item;

                const x1 =  x0 * cosRy + z0 * sinRy;
                const z1 = -x0 * sinRy + z0 * cosRy;

                const y2 =  y0 * cosRx - z1 * sinRx;
                const z2 =  y0 * sinRx + z1 * cosRx;

                const depth   = (z2 + radius) / (radius * 2);
                const scale   = 0.35 + depth * 0.85;
                const opacity = 0.15 + depth * 0.85;
                const zInt    = Math.floor(depth * 100);

                el.style.transform = `translate(-50%,-50%) translate(${x1}px,${y2}px) scale(${scale})`;
                el.style.opacity   = opacity;

                if (zInt !== item.lastZ) {
                    el.style.zIndex = zInt;
                    item.lastZ = zInt;
                }
            });
        };

        animId = requestAnimationFrame(animate);

        // ── Cleanup ───────────────────────────────────────────────────────────
        return () => {
            container.removeEventListener('mousemove',  handleMouseMove);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleLeave);

            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove',  handleTouchMove);
            container.removeEventListener('touchend',   handleLeave);
            container.removeEventListener('touchcancel', handleLeave);

            cancelAnimationFrame(animId);
            ro.disconnect();
            itemsRef.current.forEach(({ el }) => el.remove());
            itemsRef.current = [];
        };
    }, []);

    return (
        <div className="absolute left-[40vw] top-[20vh] w-[500px] justify-center z-10">
            <div ref={containerRef} className="relative w-full h-[600px]" />
            <style jsx>{`
                .icon-item {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    pointer-events: none;
                    will-change: transform, opacity;
                }
                .icon-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .icon-image {
                    width: 56px;
                    height: 56px;
                    display: block;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
                    object-fit: contain;
                }
                .icon-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: ghostwhite;
                    white-space: nowrap;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
                }
                @media (max-width: 599px) {
                    .icon-image {
                        filter: none;
                        width: 44px;
                        height: 44px;
                    }
                    .icon-label {
                        font-size: 11px;
                        text-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Rotating_Icons_Two;