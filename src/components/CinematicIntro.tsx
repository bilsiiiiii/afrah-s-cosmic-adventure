import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ParticleSystem } from '@/utils/particles';
import { Button } from '@/components/ui/button';
import earthImage from '@/assets/earth-cosmic.jpg';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [countdown, setCountdown] = useState(20);
  const [clock, setClock] = useState('23:59:59');
  const [showCelebration, setShowCelebration] = useState(false);
  const earthRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Initialize particle system
    if (canvasRef.current && !particleSystemRef.current) {
      particleSystemRef.current = new ParticleSystem(canvasRef.current);
      particleSystemRef.current.start();
    }

    // Start countdown and clock
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          triggerMidnight();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clock ticking
    const clockInterval = setInterval(() => {
      const now = new Date();
      const hours = String(23).padStart(2, '0');
      const minutes = String(59).padStart(2, '0');
      const seconds = String(60 - countdown).padStart(2, '0');
      setClock(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    // Earth rotation animation
    if (earthRef.current) {
      gsap.to(earthRef.current, {
        rotation: 360,
        duration: 12,
        ease: 'none',
        repeat: -1,
      });
    }

    return () => {
      clearInterval(countdownInterval);
      clearInterval(clockInterval);
      if (timelineRef.current) timelineRef.current.kill();
      if (particleSystemRef.current) particleSystemRef.current.stop();
    };
  }, []);

  // Acceleration effect as countdown reaches end
  useEffect(() => {
    if (countdown <= 5 && countdown > 0 && earthRef.current) {
      gsap.to(earthRef.current, {
        scale: 1.1 + (5 - countdown) * 0.05,
        duration: 0.6,
        ease: 'power1.in',
      });
    }
  }, [countdown]);

  const triggerMidnight = () => {
    // Clock flips to midnight
    setClock('00:00:00');
    
    // Create celebration timeline
    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.to(earthRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in',
    })
    .call(() => {
      // Trigger massive fireworks
      if (particleSystemRef.current) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            particleSystemRef.current?.createFirework(
              centerX + (Math.random() - 0.5) * 400,
              centerY + (Math.random() - 0.5) * 300
            );
          }, i * 120);
        }
      }
      setShowCelebration(true);
    }, null, 0.8);
  };

  const handleSkip = () => {
    if (timelineRef.current) timelineRef.current.kill();
    if (particleSystemRef.current) particleSystemRef.current.clear();
    onComplete();
  };

  return (
    <div className="fixed inset-0 cosmic-bg z-50 flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* HUD */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-20">
        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-stardust glow-text mb-4">
          A Night For Afrah
        </h1>
        <div className="flex gap-8 justify-center items-center">
          <div className="text-2xl font-poppins text-champagne">
            {clock}
          </div>
          <div className="text-5xl font-playfair font-bold text-accent glow-text">
            {countdown}
          </div>
        </div>
      </div>

      {/* Earth */}
      {!showCelebration && (
        <div
          ref={earthRef}
          className="relative w-64 h-64 md:w-96 md:h-96"
          style={{
            background: `url(${earthImage}) center/cover`,
            borderRadius: '50%',
            boxShadow: '0 0 80px rgba(244, 228, 193, 0.4), inset 0 0 40px rgba(0, 0, 0, 0.6)',
          }}
        />
      )}

      {/* Celebration popup */}
      {showCelebration && (
        <div className="text-center z-30 animate-in fade-in zoom-in duration-1000">
          <h2 className="text-6xl md:text-8xl font-playfair font-black text-champagne glow-text mb-8">
            HAPPY 20th,<br />AFRAH! 🎉
          </h2>
          <Button
            onClick={handleSkip}
            size="lg"
            className="text-xl px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Enter the Birthday Room
          </Button>
        </div>
      )}

      {/* Skip button */}
      {!showCelebration && (
        <Button
          onClick={handleSkip}
          variant="ghost"
          className="absolute bottom-8 right-8 text-muted-foreground hover:text-foreground"
        >
          Skip (Esc)
        </Button>
      )}
    </div>
  );
};
