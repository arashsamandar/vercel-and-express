// All constants stay exactly the same
const PARTICLE_RADIUS = 2.5;
const PARTICLE_SPEED_FACTOR = 0.5;
const CONNECTION_DISTANCE = 180;
const PARTICLE_COLOR = 'rgba(191, 219, 254, 0.8)';
const LINE_COLOR_BASE = 'rgba(160,200,220,';
const PARTICLES_PER_SQ_PIXEL = 15000;
const MAX_PARTICLES = 1166;
const MOUSE_RADIUS = 250;
const MOUSE_PULL_FACTOR = 0.5;

// Particle class stays exactly the same
class Particle {
    constructor(x, y, directionX, directionY, radius, color, canvasWidth, canvasHeight) {
        this.x = x; this.y = y;
        this.directionX = directionX; this.directionY = directionY;
        this.radius = radius; this.color = color;
        this.canvasWidth = canvasWidth; this.canvasHeight = canvasHeight;
        this.density = (Math.random() * 4) + 1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(mouse) {
        if (this.x + this.radius > this.canvasWidth || this.x - this.radius < 0)
            this.directionX = -this.directionX;
        if (this.y + this.radius > this.canvasHeight || this.y - this.radius < 0)
            this.directionY = -this.directionY;

        if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.hypot(dx, dy);
            if (distance < mouse.radius) {
                const forceDirX = dx / distance;
                const forceDirY = dy / distance;
                const rawForce = (mouse.radius - distance) / mouse.radius;
                const pull = rawForce * this.density * MOUSE_PULL_FACTOR;
                this.x += forceDirX * pull;
                this.y += forceDirY * pull;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
    }
}

// --- Worker-level state ---
let canvas, ctx;
let particlesArray = [];
let intervalId;
let width, height;
const mouse = { x: undefined, y: undefined, radius: MOUSE_RADIUS };

const createParticles = () => {
    particlesArray = [];
    const isMobile = width < 768;
    const currentMin = isMobile ? 35 : 60;
    const currentMax = isMobile ? 100 : MAX_PARTICLES;
    let count = Math.floor((width * height) / PARTICLES_PER_SQ_PIXEL);
    count = Math.max(currentMin, Math.min(count, currentMax));

    for (let i = 0; i < count; i++) {
        const r = PARTICLE_RADIUS;
        const x = Math.random() * (width - r * 2) + r;
        const y = Math.random() * (height - r * 2) + r;
        const dx = (Math.random() - 0.5) * 2 * PARTICLE_SPEED_FACTOR;
        const dy = (Math.random() - 0.5) * 2 * PARTICLE_SPEED_FACTOR;
        particlesArray.push(new Particle(x, y, dx, dy, r, PARTICLE_COLOR, width, height));
    }
};

const connectParticles = () => {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.hypot(dx, dy);
            if (distance < CONNECTION_DISTANCE) {
                const opacity = 1 - distance / CONNECTION_DISTANCE;
                ctx.strokeStyle = `${LINE_COLOR_BASE}${opacity.toFixed(2)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
};

const animate = () => {
    ctx.clearRect(0, 0, width, height);
    particlesArray.forEach(p => { p.update(mouse); p.draw(ctx); });
    connectParticles();
};

// --- Receive messages from the main thread ---
self.onmessage = (e) => {
    const { type } = e.data;

    if (type === 'init') {
        canvas = e.data.canvas;           // this is already an OffscreenCanvas
        width = e.data.width;
        height = e.data.height;
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        createParticles();
        // rAF doesn't exist in workers — setInterval at ~60fps is the replacement
        intervalId = setInterval(animate, 1000 / 60);
    }

    if (type === 'mousemove') {
        mouse.x = e.data.x;
        mouse.y = e.data.y;
    }

    if (type === 'mouseleave') {
        mouse.x = undefined;
        mouse.y = undefined;
    }

    if (type === 'resize') {
        width = e.data.width;
        height = e.data.height;
        canvas.width = width;
        canvas.height = height;
        createParticles();
    }

    if (type === 'stop') {
        clearInterval(intervalId);
    }
};