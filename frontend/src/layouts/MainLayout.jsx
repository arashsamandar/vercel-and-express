import React, {useEffect, useRef, useState} from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

const PARTICLE_RADIUS = 2.5;
const PARTICLE_SPEED_FACTOR = 0.5;
const CONNECTION_DISTANCE = 150;
const PARTICLE_COLOR = 'rgba(191, 219, 254, 0.8)'; // Tailwind blue-200 with opacity
const LINE_COLOR = 'rgba(147, 197, 253, 0.3)';    // Tailwind blue-300 with opacity
const MIN_PARTICLES = window.innerWidth < 768 ? 50 : 100;
const MAX_PARTICLES = window.innerWidth < 768 ? 80 : 160;

const PARTICLES_PER_SQ_PIXEL = 15000;

class Particle {
    constructor(x, y, directionX, directionY, radius, color, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.radius = radius;
        this.color = color;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    // Method to draw individual particle on the canvas
    draw(ctx) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Method to update particle's position and handle bouncing off edges
    update() {
        // Bounce off edges
        if (this.x + this.radius > this.canvasWidth || this.x - this.radius < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.radius > this.canvasHeight || this.y - this.radius < 0) {
            this.directionY = -this.directionY;
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
    }

    // Update canvas dimensions if they change (e.g., on resize)
    updateCanvasDimensions(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }
}

export default function MainLayout() {


    const canvasRef = useRef(null);
    // particlesArrayRef is used to store the particles array.
    // Using useRef instead of useState for particlesArray avoids re-renders on every particle update,
    // which significantly improves performance for animations with many elements.
    const particlesArrayRef = useRef([]);
    const animationFrameIdRef = useRef(null);

    // State for canvas dimensions to trigger re-initialization on resize
    const [canvasDimensions, setCanvasDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    // --- Initialization and Resize Handling ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        canvas.width = canvasDimensions.width;
        canvas.height = canvasDimensions.height;

        // Function to initialize particles
        const init = () => {
            particlesArrayRef.current = [];
            const screenArea = canvas.width * canvas.height;
            let numParticles = Math.floor(screenArea / PARTICLES_PER_SQ_PIXEL);
            numParticles = Math.max(MIN_PARTICLES, Math.min(numParticles, MAX_PARTICLES));


            for (let i = 0; i < numParticles; i++) {
                const radius = PARTICLE_RADIUS;
                const x = Math.random() * (canvas.width - radius * 2) + radius;
                const y = Math.random() * (canvas.height - radius * 2) + radius;
                const directionX = (Math.random() - 0.5) * 2 * PARTICLE_SPEED_FACTOR;
                const directionY = (Math.random() - 0.5) * 2 * PARTICLE_SPEED_FACTOR;
                particlesArrayRef.current.push(new Particle(x, y, directionX, directionY, radius, PARTICLE_COLOR, canvas.width, canvas.height));
            }
        };

        init(); // Initialize particles

        // Update particle canvas dimensions if they already exist
        // This is important if particles were initialized before a resize that changes canvasDimensions.
        particlesArrayRef.current.forEach(particle => {
            particle.updateCanvasDimensions(canvas.width, canvas.height);
        });


        // Handle window resize
        const handleResize = () => {
            setCanvasDimensions({ width: window.innerWidth, height: window.innerHeight });
            // No need to call init() here directly, the effect will re-run due to canvasDimensions change
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function for event listener
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [canvasDimensions]); // Re-run effect when canvasDimensions change

    // --- Animation Loop ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Function to connect particles with lines
        const connectParticles = () => {
            if (!ctx) return;
            const particles = particlesArrayRef.current;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const distance = Math.sqrt(
                        Math.pow(particles[a].x - particles[b].x, 2) +
                        Math.pow(particles[a].y - particles[b].y, 2)
                    );

                    if (distance < CONNECTION_DISTANCE) {
                        const opacityValue = 1 - (distance / CONNECTION_DISTANCE);
                        ctx.strokeStyle = LINE_COLOR.replace(/[\d\.]+\)$/g, `${opacityValue.toFixed(2)})`);
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Main animation function
        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesArrayRef.current.forEach(particle => {
                particle.update();
                particle.draw(ctx);
            });
            connectParticles();
            animationFrameIdRef.current = requestAnimationFrame(animate);
        };

        animate(); // Start animation

        // Cleanup function for animation frame
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [canvasDimensions]); // Re-run effect if canvasDimensions change to restart animation with new sizes



    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="bg-gradient-to-bl from-sky-500 to-indigo-500">
                <Outlet />
            </main>
            <canvas ref={canvasRef} className="fixed top-0 left-0 z-10" />
            <Footer/>
        </div>
    )
}