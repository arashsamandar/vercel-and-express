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

        // ── Build elements & PRE-COMPUTE static sphere coords ─────────────────
        // OPTIMIZATION 1 (biggest win):
        //   Original code stored phi/theta as dataset strings and called
        //   Math.sin/cos(phi,theta) + parseFloat() on EVERY frame for EVERY icon.
        //   These positions never change — compute once, store as plain numbers.
        //   Savings: 4 trig calls × 15 icons × 60 fps = ~3,600 ops/sec eliminated.
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
                lastZ: -1,   // sentinel to skip zIndex writes when value unchanged
            });
        });

        // ── Cache container rect; refresh only on resize ──────────────────────
        // OPTIMIZATION 2:
        //   Original code called getBoundingClientRect() inside mousemove —
        //   every mouse event triggered a layout read. Now it's cached and
        //   only refreshed by ResizeObserver when the container actually resizes.
        let rect = container.getBoundingClientRect();
        const ro = new ResizeObserver(() => { rect = container.getBoundingClientRect(); });
        ro.observe(container);

        // ── Event handlers ────────────────────────────────────────────────────
        const handleMouseMove = (e) => {
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            targetOffsetY = ((e.clientX - cx) / (rect.width  / 2)) * 1.5;
            targetOffsetX = ((e.clientY - cy) / (rect.height / 2)) * 1.5;
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
        // OPTIMIZATION 3: Frame-rate cap
        //   Why rAF and NOT setInterval?
        //     • rAF auto-pauses when the tab is hidden → no background CPU drain
        //     • rAF syncs to display refresh → no tearing or jank
        //     • setInterval stacks up if JS is slow → burst jank
        //   We get "run at 30fps on mobile" simply by skipping frames that arrive
        //   too soon. No setInterval needed.
        const TARGET_FPS = isMobile ? 30 : 60;
        const FRAME_MS   = 1000 / TARGET_FPS;
        let lastTime = 0;
        let animId;

        const animate = (ts) => {
            animId = requestAnimationFrame(animate);

            // Skip this frame if we're ahead of our target FPS
            if (ts - lastTime < FRAME_MS) return;
            lastTime = ts;

            // Auto-spin while idle
            if (!isHovered) { rotY += 0.008; rotX += 0.003; }

            // Ease toward mouse target
            offsetX += (targetOffsetX - offsetX) * 0.05;
            offsetY += (targetOffsetY - offsetY) * 0.05;

            const rx = rotX + offsetX;
            const ry = rotY + offsetY;

            // OPTIMIZATION 4: Per-frame trig pre-computation
            //   cos(rx)/sin(rx)/cos(ry)/sin(ry) are the same for every icon in
            //   this frame. Compute once, share across all N icons.
            //   Savings: 4 trig calls × 15 icons × 60fps = ~3,600 ops/sec eliminated.
            const cosRx = Math.cos(rx), sinRx = Math.sin(rx);
            const cosRy = Math.cos(ry), sinRy = Math.sin(ry);

            itemsRef.current.forEach((item) => {
                const { el, x0, y0, z0 } = item;

                // Y-axis rotation
                const x1 =  x0 * cosRy + z0 * sinRy;
                const z1 = -x0 * sinRy + z0 * cosRy;

                // X-axis rotation (x is unaffected, so x2 === x1 — no extra variable)
                const y2 =  y0 * cosRx - z1 * sinRx;
                const z2 =  y0 * sinRx + z1 * cosRx;

                const depth   = (z2 + radius) / (radius * 2); // 0 = back, 1 = front
                const scale   = 0.35 + depth * 0.85;
                const opacity = 0.15 + depth * 0.85;
                const zInt    = Math.floor(depth * 100);

                // transform + opacity: GPU-composited, virtually free to update
                el.style.transform = `translate(-50%,-50%) translate(${x1}px,${y2}px) scale(${scale})`;
                el.style.opacity   = opacity;

                // OPTIMIZATION 5: Guard zIndex writes
                //   zIndex changes trigger a stacking-context recalc in the browser.
                //   Only write it when the integer value actually changed.
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
                    /*
                     * OPTIMIZATION 6: will-change
                     * Tells the browser these elements will animate transform + opacity
                     * so it promotes them to GPU compositing layers.
                     * Updates happen off the main thread — the browser no longer
                     * has to re-paint or re-layout on every frame.
                     */
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

                /*
                 * OPTIMIZATION 7: Remove expensive paint effects on mobile
                 * CSS filter (drop-shadow) and text-shadow both require the
                 * browser to re-paint the element every frame. On weak GPUs
                 * (like the Galaxy A57) this is a major bottleneck. Skip them.
                 */
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