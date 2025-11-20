// Canvas particle system for fireworks and confetti

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'confetti' | 'firework' | 'spark';
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private maxParticles = 250;
  private animationId: number | null = null;
  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createFirework(x: number, y: number, count = 80) {
    const colors = ['#F4E4C1', '#E8B86D', '#D4A574', '#9B7EBD'];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      
      this.addParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
        type: 'firework',
      });
    }
  }

  createConfetti(x: number, y: number, count = 30) {
    const colors = ['#F4E4C1', '#E8B86D', '#D4A574', '#9B7EBD', '#4A5B8C'];
    
    for (let i = 0; i < count; i++) {
      this.addParticle({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 10 - 5,
        life: 1,
        maxLife: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        type: 'confetti',
      });
    }
  }

  createSpark(x: number, y: number, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      
      this.addParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color: '#F4E4C1',
        size: 2 + Math.random() * 2,
        type: 'spark',
      });
    }
  }

  private addParticle(particle: Particle) {
    // Cull oldest if at max capacity
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }
    this.particles.push(particle);
  }

  private update(deltaTime: number) {
    const dt = deltaTime / 16; // normalize to ~60fps
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Physics
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.3 * dt; // gravity
      p.vx *= 0.99; // air resistance
      
      // Life decay
      p.life -= (1 / p.maxLife) * 0.016 * dt;
      
      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      
      if (p.type === 'confetti') {
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.vx * 0.1);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
    });
  }

  start() {
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      
      this.update(deltaTime);
      this.draw();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  clear() {
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
