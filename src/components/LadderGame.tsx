import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { loadProgress, markStepComplete, markGameComplete, resetProgress } from '@/utils/storage';
import { ParticleSystem } from '@/utils/particles';
import { useToast } from '@/hooks/use-toast';

const LADDER_MESSAGES = [
  "Every journey begins with a single step",
  "Believe in your dreams",
  "You are stronger than you know",
  "Chase what sets your soul on fire",
  "Today is your day to shine",
  "Keep climbing, you're doing amazing",
  "Your potential is limitless",
  "Celebrate every small victory",
  "You inspire those around you",
  "Halfway there - keep going!",
  "Your courage is admirable",
  "Trust the process",
  "You're making incredible progress",
  "Never stop believing in yourself",
  "Almost at the summit!",
  "Your perseverance is beautiful",
  "Great things take time",
  "You're unstoppable",
  "One more step to greatness",
  "You made it! Happy 20th Birthday! 🎊"
];

export const LadderGame = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const characterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load progress
    const progress = loadProgress();
    setCurrentStep(progress.currentStep);

    // Initialize particle system
    if (canvasRef.current && !particleSystemRef.current) {
      particleSystemRef.current = new ParticleSystem(canvasRef.current);
      particleSystemRef.current.start();
    }

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        climbStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (particleSystemRef.current) particleSystemRef.current.stop();
    };
  }, []);

  const climbStep = () => {
    if (isAnimating || currentStep >= 20) return;

    setIsAnimating(true);
    const nextStep = currentStep + 1;

    // Animate character
    if (characterRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          setCurrentStep(nextStep);
          markStepComplete(nextStep);

          // Show message
          toast({
            title: LADDER_MESSAGES[nextStep - 1],
            duration: 1500,
          });

          // Particles
          if (particleSystemRef.current && characterRef.current) {
            const rect = characterRef.current.getBoundingClientRect();
            particleSystemRef.current.createSpark(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2
            );

            // Milestone celebrations
            if (nextStep % 5 === 0) {
              setTimeout(() => {
                if (particleSystemRef.current && characterRef.current) {
                  const rect = characterRef.current.getBoundingClientRect();
                  particleSystemRef.current.createConfetti(
                    rect.left + rect.width / 2,
                    rect.top
                  );
                }
              }, 200);
            }
          }

          // Final celebration
          if (nextStep === 20) {
            markGameComplete();
            setTimeout(() => {
              if (particleSystemRef.current) {
                for (let i = 0; i < 3; i++) {
                  setTimeout(() => {
                    particleSystemRef.current?.createFirework(
                      window.innerWidth / 2 + (Math.random() - 0.5) * 300,
                      window.innerHeight / 3
                    );
                  }, i * 150);
                }
              }
              toast({
                title: "🎉 Congratulations! 🎉",
                description: "You've completed the ladder!",
                duration: 5000,
              });
            }, 500);
          }
        }
      });

      // Jump animation with squash & stretch
      tl.to(characterRef.current, {
        y: -50,
        scaleX: 0.9,
        scaleY: 1.1,
        duration: 0.3,
        ease: 'power1.out',
      })
      .to(characterRef.current, {
        y: -(nextStep * 40),
        scaleX: 1.1,
        scaleY: 0.9,
        duration: 0.3,
        ease: 'back.out(1.4)',
      });
    }
  };

  const handleReset = () => {
    resetProgress();
    setCurrentStep(0);
    if (characterRef.current) {
      gsap.to(characterRef.current, { y: 0, duration: 0.5 });
    }
    toast({
      title: "Progress reset",
      description: "Start climbing again!",
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-16">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />

      <div className="relative z-10 max-w-4xl w-full px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-playfair font-bold text-champagne mb-4">
            The Ladder of 20
          </h2>
          <p className="text-muted-foreground mb-4">
            Climb the 20 steps to celebrate your journey
          </p>
          <Progress value={(currentStep / 20) * 100} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of 20
          </p>
        </div>

        {/* Ladder visualization */}
        <div className="relative h-[600px] bg-card/30 backdrop-blur-sm rounded-lg p-8 overflow-hidden">
          {/* Steps */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-48">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`h-10 border-t-2 ${
                  i < currentStep ? 'border-primary' : 'border-border'
                } relative transition-colors duration-300`}
                style={{ marginBottom: i === 19 ? 0 : '30px' }}
              >
                <div className="absolute left-1/2 -translate-x-1/2 -top-3 text-xs text-muted-foreground">
                  {20 - i}
                </div>
              </div>
            ))}
          </div>

          {/* Character */}
          <div
            ref={characterRef}
            onClick={climbStep}
            className="absolute left-1/2 -translate-x-1/2 bottom-8 w-16 h-16 bg-primary rounded-full cursor-pointer interactive-glow flex items-center justify-center text-2xl"
            style={{ transformOrigin: 'center bottom' }}
          >
            🎈
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center mt-8">
          <Button
            onClick={climbStep}
            disabled={isAnimating || currentStep >= 20}
            size="lg"
            className="text-lg"
          >
            Climb ↑
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            Reset Progress
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Click the balloon, press ↑ or Space to climb
        </p>
      </div>
    </div>
  );
};
