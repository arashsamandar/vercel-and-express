import React, { useEffect, useRef } from 'react';

const Rotating_Icons_Two = () => {
    const containerRef = useRef(null);
    // Each item: { el, x0, y0, z0, lastZ }
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

        // ── Mouse handlers ────────────────────────────────────────────────────
        const handleMouseMove = (e) => {
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            // FIX 1: Use the SAME base for both axes.
            //   Before: width/2=250 horizontal, height/2=300 vertical → 20% more
            //   sensitive horizontally because the container is 500×600.
            //   Now: both axes divide by min(250, 300) = 250 → equal rad/px everywhere.
            const base = Math.min(rect.width, rect.height) / 2;
            targetOffsetY = ((e.clientX - cx) / base) * 1.2;
            targetOffsetX = ((e.clientY - cy) / base) * 1.2;
            // 1.2 rad max (≈69°) — down from 1.5 for a more controlled feel.
        };
        const handleMouseEnter = () => { isHovered = true; };
        const handleMouseLeave = () => {
            isHovered = false;
            rotX += offsetX; rotY += offsetY;
            offsetX = offsetY = targetOffsetX = targetOffsetY = 0;
        };

        container.addEventListener('mousemove',  handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        // ── Animation loop — rAF + timestamp throttle ─────────────────────────
        const TARGET_FPS = isMobile ? 30 : 60;
        const FRAME_MS   = 1000 / TARGET_FPS;
        let lastTime = 0;
        let animId;

        const animate = (ts) => {
            animId = requestAnimationFrame(animate);
            if (ts - lastTime < FRAME_MS) return;

            // FIX 2 & 3: Frame-rate-independent motion.
            //   Capture elapsed BEFORE overwriting lastTime.
            //   Cap at 100ms so a tab waking from sleep doesn't cause a jump.
            const elapsed = Math.min(ts - lastTime, 100);
            lastTime = ts;

            // t = "how many 60fps frames worth of time just elapsed"
            //   At 60fps: t ≈ 1 → multiply by 1 → same as before.
            //   At 30fps: t ≈ 2 → auto-spin delta doubles per frame, same rad/sec.
            const t = elapsed / (1000 / 60);

            // FIX 3: Auto-spin — was fps-dependent; on mobile it ran at half speed.
            if (!isHovered) { rotY += 0.008 * t; rotX += 0.003 * t; }

            // FIX 2: Lerp easing — was fps-dependent; mobile felt sluggish.
            //   Math.pow(0.95, t): at t=1 → 0.95^1 = 0.95 (same 5% step as before).
            //   At t=2 (30fps) → 0.95^2 = 0.9025 → ~10% step → covers same distance/sec.
            const lerpFactor = 1 - Math.pow(0.95, t);
            offsetX += (targetOffsetX - offsetX) * lerpFactor;
            offsetY += (targetOffsetY - offsetY) * lerpFactor;

            const rx = rotX + offsetX;
            const ry = rotY + offsetY;

            // Pre-compute sin/cos once per frame, shared across all icons
            const cosRx = Math.cos(rx), sinRx = Math.sin(rx);
            const cosRy = Math.cos(ry), sinRy = Math.sin(ry);

            itemsRef.current.forEach((item) => {
                const { el, x0, y0, z0 } = item;

                // Y-axis rotation (horizontal spin)
                const x1 =  x0 * cosRy + z0 * sinRy;
                const z1 = -x0 * sinRy + z0 * cosRy;

                // X-axis rotation (x is unaffected, x2 === x1)
                const y2 =  y0 * cosRx - z1 * sinRx;
                const z2 =  y0 * sinRx + z1 * cosRx;

                const depth   = (z2 + radius) / (radius * 2);
                const scale   = 0.35 + depth * 0.85;
                const opacity = 0.15 + depth * 0.85;
                const zInt    = Math.floor(depth * 100);

                el.style.transform = `translate(-50%,-50%) translate(${x1}px,${y2}px) scale(${scale})`;
                el.style.opacity   = opacity;

                if (zInt !== item.lastZ) { el.style.zIndex = zInt; item.lastZ = zInt; }
            });
        };

        animId = requestAnimationFrame(animate);

        // ── Cleanup ───────────────────────────────────────────────────────────
        return () => {
            container.removeEventListener('mousemove',  handleMouseMove);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animId);
            ro.disconnect();
            itemsRef.current.forEach(({ el }) => el.remove());
            itemsRef.current = [];
        };
    }, []);

    return (
        <div className="flex w-[500px] justify-center z-10">
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
                    color: white;
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