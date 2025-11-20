import { useState, useRef, useEffect } from 'react';
import { CinematicIntro } from '@/components/CinematicIntro';
import { LadderGame } from '@/components/LadderGame';
import { CakeSection } from '@/components/CakeSection';
import { GiftShelf } from '@/components/GiftShelf';
import { NavigationPanel } from '@/components/NavigationPanel';
import roomImage from '@/assets/birthday-room.jpg';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const ladderRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const giftsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user wants to skip intro (for development)
    const skipIntro = sessionStorage.getItem('skipIntro');
    if (skipIntro === 'true') {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('skipIntro', 'true');
  };

  const handleNavigate = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      ladder: ladderRef,
      cake: cakeRef,
      gifts: giftsRef,
    };

    refs[section]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  if (showIntro) {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div 
      className="relative min-h-screen cosmic-bg"
      style={{
        backgroundImage: `url(${roomImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-cosmic-deep/70 backdrop-blur-sm" />

      {/* Navigation panel */}
      <NavigationPanel onNavigate={handleNavigate} />

      {/* Content sections */}
      <div className="relative z-10">
        {/* Welcome header */}
        <div className="min-h-screen flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-playfair font-black text-champagne glow-text mb-6">
              Welcome to<br />Your Birthday Room
            </h1>
            <p className="text-xl md:text-2xl text-stardust mb-8">
              Explore the room, play the ladder game, cut your cake, and open your gifts
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => handleNavigate('ladder')}
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-lg transition-all interactive-glow"
              >
                Start the Ladder Game 🪜
              </button>
            </div>
          </div>
        </div>

        {/* Ladder section */}
        <div ref={ladderRef} id="ladder">
          <LadderGame />
        </div>

        {/* Cake section */}
        <div ref={cakeRef} id="cake">
          <CakeSection />
        </div>

        {/* Gifts section */}
        <div ref={giftsRef} id="gifts">
          <GiftShelf />
        </div>

        {/* Footer */}
        <footer className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-playfair">
            Made with ❤️ for Afrah's 20th Birthday
          </p>
          <p className="text-sm mt-2">
            Press Esc to reload the cinematic intro
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
