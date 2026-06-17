import React, { useEffect, useRef } from 'react';

const Rotating_Icons_Two = () => {
    const containerRef = useRef(null);
    const iconsRef = useRef([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const icons = [
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
        const radius = window.innerWidth < 600 ? 150 : 260;

        // Base rotation — accumulates during auto-spin while mouse is away
        let rotX = 0;
        let rotY = 0;

        // Mouse offset — layered on top of base rotation while hovering.
        // On mouse leave, absorbed into rotX/rotY so the sphere never jumps.
        let offsetX = 0;
        let offsetY = 0;
        let targetOffsetX = 0;
        let targetOffsetY = 0;

        let isHovered = false;

        // ── Build icon elements (Fibonacci sphere distribution) ───────────────
        icons.forEach((icon, i) => {
            const phi   = Math.acos(1 - 2 * (i + 0.5) / icons.length);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;

            const iconEl = document.createElement('div');
            iconEl.className = 'icon-item';
            iconEl.innerHTML = `
                <div class="icon-content">
                    <img src="${icon.img}" alt="${icon.name}" class="icon-image" />
                    <span class="icon-label">${icon.name}</span>
                </div>
            `;
            iconEl.dataset.phi   = phi;
            iconEl.dataset.theta = theta;
            container.appendChild(iconEl);
            iconsRef.current.push(iconEl);
        });

        // ── Position all icons given total rotation rx, ry ────────────────────
        const updatePositions = (rx, ry) => {
            iconsRef.current.forEach((iconEl) => {
                const phi   = parseFloat(iconEl.dataset.phi);
                const theta = parseFloat(iconEl.dataset.theta);

                const x0 = radius * Math.sin(phi) * Math.cos(theta);
                const y0 = radius * Math.cos(phi);
                const z0 = radius * Math.sin(phi) * Math.sin(theta);

                // Y-axis rotation (left / right)
                const x1 =  x0 * Math.cos(ry) + z0 * Math.sin(ry);
                const y1 =  y0;
                const z1 = -x0 * Math.sin(ry) + z0 * Math.cos(ry);

                // X-axis rotation (up / down)
                const x2 =  x1;
                const y2 =  y1 * Math.cos(rx) - z1 * Math.sin(rx);
                const z2 =  y1 * Math.sin(rx) + z1 * Math.cos(rx);

                const depthNorm = (z2 + radius) / (radius * 2); // 0 = back, 1 = front
                const scale     = 0.35 + depthNorm * 0.85;
                const opacity   = 0.15 + depthNorm * 0.85;

                iconEl.style.transform = `translate(-50%, -50%) translate(${x2}px, ${y2}px) scale(${scale})`;
                iconEl.style.opacity   = opacity;
                iconEl.style.zIndex    = Math.floor(depthNorm * 100);
            });
        };

        // ── Event handlers ────────────────────────────────────────────────────
        const handleMouseMove = (e) => {
            const rect    = container.getBoundingClientRect();
            const centerX = rect.left + rect.width  / 2;
            const centerY = rect.top  + rect.height / 2;
            // Mouse position maps directly to sphere orientation offset
            targetOffsetY = ((e.clientX - centerX) / (rect.width  / 2)) * 1.5;
            targetOffsetX = ((e.clientY - centerY) / (rect.height / 2)) * 1.5;
        };

        const handleMouseEnter = () => { isHovered = true; };

        const handleMouseLeave = () => {
            isHovered = false;
            // KEY: absorb current offset into the base rotation.
            // (rotX + offsetX) stays identical at this exact moment,
            // so the sphere holds its position and auto-spin resumes
            // from exactly there — no reversal, no shock.
            rotX += offsetX;
            rotY += offsetY;
            offsetX       = 0;
            offsetY       = 0;
            targetOffsetX = 0;
            targetOffsetY = 0;
        };

        container.addEventListener('mousemove',  handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        // ── Animation loop ────────────────────────────────────────────────────
        let animationId;
        const animate = () => {
            // Auto-spin only while the mouse is away.
            // Pausing it on hover means left/right and up/down offsets
            // are equally visible — neither fights the auto-rotation.
            if (!isHovered) {
                rotY += 0.008;
                rotX += 0.003;
            }

            // Smoothly follow the mouse target
            offsetX += (targetOffsetX - offsetX) * 0.05;
            offsetY += (targetOffsetY - offsetY) * 0.05;

            updatePositions(rotX + offsetX, rotY + offsetY);
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            container.removeEventListener('mousemove',  handleMouseMove);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationId);
            iconsRef.current.forEach(icon => icon.remove());
            iconsRef.current = [];
        };
    }, []);

    return (
        <div className="flex w-[500px] justify-center z-10">
            <div
                ref={containerRef}
                className="relative w-full h-[600px]"
            />
            <style jsx>{`
                .icon-item {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    pointer-events: none;
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
            `}</style>
        </div>
    );
};

export default Rotating_Icons_Two;