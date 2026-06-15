import React, { useEffect, useRef } from 'react';

const Rotating_Icons_Two = () => {
    const containerRef = useRef(null);
    const iconsRef = useRef([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const icons = [
            { img: 'https://cdn.simpleicons.org/react/61DAFB', name: 'React' },
            { img: 'https://cdn.simpleicons.org/javascript/F7DF1E', name: 'JavaScript' },
            { img: 'https://cdn.simpleicons.org/css/1572B6', name: 'CSS' },
            { img: 'https://cdn.simpleicons.org/html5/E34F26', name: 'HTML' },
            { img: 'https://cdn.simpleicons.org/nodedotjs/339933', name: 'Node.js' },
            { img: 'https://cdn.simpleicons.org/laravel/3776AB', name: 'Laravel' },
            { img: 'https://cdn.simpleicons.org/git/F05032', name: 'Git' },
            { img: 'https://cdn.simpleicons.org/docker/2496ED', name: 'Docker' },
            { img: 'https://cdn.simpleicons.org/supabase/FF9900', name: 'Java' },
            { img: 'https://cdn.simpleicons.org/postgresql/4169E1', name: 'PostgreSQL' },
            { img: 'https://cdn.simpleicons.org/typescript/3178C6', name: 'TypeScript' },
            { img: 'https://cdn.simpleicons.org/mongodb/4FC08D', name: 'MongoDB' },
            { img: 'https://cdn.simpleicons.org/nextdotjs/000000', name: 'Next.js' },
            { img: 'https://cdn.simpleicons.org/php/000000', name: 'Php' },
            { img: 'https://cdn.simpleicons.org/firebase/FFCA28', name: 'Firebase' },
        ];

        const container = containerRef.current;
        let radius = 300;
        if(window.innerWidth < 600){
            radius = 180;
        }

        let angleX = 0;        // mouse offset X (smoothed)
        let angleY = 0;        // mouse offset Y (smoothed)
        let targetAngleX = 0;  // raw mouse target X
        let targetAngleY = 0;  // raw mouse target Y
        let autoRotateY = 0;   // accumulated auto-rotation Y
        let autoRotateX = 0;   // accumulated auto-rotation X

        // Build icon elements using Fibonacci sphere distribution
        icons.forEach((icon, i) => {
            const phi = Math.acos(1 - 2 * (i + 0.5) / icons.length);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;

            const iconEl = document.createElement('div');
            iconEl.className = 'icon-item';
            iconEl.innerHTML = `
                <div class="icon-content">
                    <img src="${icon.img}" alt="${icon.name}" class="icon-image" />
                    <span class="icon-label">${icon.name}</span>
                </div>
            `;
            iconEl.dataset.phi = phi;
            iconEl.dataset.theta = theta;
            container.appendChild(iconEl);
            iconsRef.current.push(iconEl);
        });

        const updatePositions = () => {
            const rotY = autoRotateY + angleY;
            const rotX = autoRotateX + angleX;

            iconsRef.current.forEach((iconEl) => {
                const phi = parseFloat(iconEl.dataset.phi);
                const theta = parseFloat(iconEl.dataset.theta);

                // FIX 2: Base 3D position on unit sphere
                const x0 = radius * Math.sin(phi) * Math.cos(theta);
                const y0 = radius * Math.cos(phi);
                const z0 = radius * Math.sin(phi) * Math.sin(theta);

                // FIX 2: Apply Y-axis rotation matrix
                const x1 = x0 * Math.cos(rotY) + z0 * Math.sin(rotY);
                const y1 = y0;
                const z1 = -x0 * Math.sin(rotY) + z0 * Math.cos(rotY);

                // FIX 2: Apply X-axis rotation matrix
                const x2 = x1;
                const y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
                const z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);

                // Normalize depth to [0, 1]
                const depthNorm = (z2 + radius) / (radius * 2);

                const scale = 0.4 + depthNorm * 0.8;
                const opacity = 0.2 + depthNorm * 0.8;

                iconEl.style.transform = `translate(-50%, -50%) translate(${x2}px, ${y2}px) scale(${scale})`;
                iconEl.style.opacity = opacity;
                iconEl.style.zIndex = Math.floor(depthNorm * 100);
            });
        };

        let isMouseOver = false;

        const handleMouseMove = (e) => {
            if (!isMouseOver) return;
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            targetAngleY = ((e.clientX - centerX) / (rect.width / 2)) * 1.2;
            targetAngleX = ((e.clientY - centerY) / (rect.height / 2)) * 1.2;
        };

        const handleMouseEnter = () => { isMouseOver = true; };

        const handleMouseLeave = () => {
            isMouseOver = false;
            targetAngleX = 0;
            targetAngleY = 0;
        };

        // FIX 1: Actually attach the listeners — these were defined but never added
        window.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        let animationId;
        const animate = () => {
            autoRotateY += 0.008;
            autoRotateX += 0.003;

            // Smooth interpolation toward mouse target
            angleX += (targetAngleX - angleX) * 0.05;
            angleY += (targetAngleY - angleY) * 0.05;

            updatePositions();
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationId);
            iconsRef.current.forEach(icon => icon.remove());
            iconsRef.current = [];
        };
    }, []);

    return (
        // FIX 3: Added `relative w-full` — container needs position:relative for absolute
        //         children, and a defined width so rect.width isn't 0 in the mouse handler
        <div className="flex w-screen justify-center z-10">
            <div
                ref={containerRef}
                className="relative w-full h-[500px]"
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