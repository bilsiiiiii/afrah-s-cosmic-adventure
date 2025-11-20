import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveProgress } from '@/utils/storage';

const CAKES = [
  { id: 'chocolate', name: 'Chocolate Dream', emoji: '🍫', color: '#8B4513' },
  { id: 'strawberry', name: 'Strawberry Bliss', emoji: '🍓', color: '#FFB6C1' },
  { id: 'vanilla', name: 'Vanilla Delight', emoji: '🍰', color: '#F5DEB3' },
  { id: 'rainbow', name: 'Rainbow Joy', emoji: '🌈', color: '#FF69B4' },
];

export const CakeSection = () => {
  const [selectedCake, setSelectedCake] = useState<string | null>(null);
  const [isCut, setIsCut] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const { toast } = useToast();

  const handleCakeSelect = (cakeId: string) => {
    setSelectedCake(cakeId);
    setIsCut(false);
    setCandleLit(true);
    toast({
      title: "Cake selected!",
      description: `${CAKES.find(c => c.id === cakeId)?.name} looks delicious!`,
    });
  };

  const handleCutCake = () => {
    if (!selectedCake) {
      toast({
        title: "Select a cake first!",
        variant: "destructive",
      });
      return;
    }

    setIsCut(true);
    saveProgress({ cakeCut: true });
    toast({
      title: "🎂 Cake cut!",
      description: "Time to enjoy your delicious slice!",
      duration: 3000,
    });
  };

  const handleBlowCandle = () => {
    if (!candleLit) return;
    
    setCandleLit(false);
    saveProgress({ candlesBlown: true });
    toast({
      title: "🕯️ Candles blown!",
      description: "Make a wish! 🌟",
      duration: 3000,
    });
  };

  const selectedCakeData = CAKES.find(c => c.id === selectedCake);

  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="max-w-4xl w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-champagne mb-4">
            Choose Your Cake
          </h2>
          <p className="text-muted-foreground">
            Select a delicious cake to celebrate
          </p>
        </div>

        {/* Cake selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {CAKES.map(cake => (
            <button
              key={cake.id}
              onClick={() => handleCakeSelect(cake.id)}
              className={`p-6 rounded-lg transition-all duration-300 ${
                selectedCake === cake.id
                  ? 'bg-primary/20 border-2 border-primary scale-105'
                  : 'bg-card border-2 border-border hover:border-primary/50'
              }`}
            >
              <div className="text-6xl mb-3">{cake.emoji}</div>
              <p className="text-sm font-medium">{cake.name}</p>
            </button>
          ))}
        </div>

        {/* Cake display */}
        {selectedCake && (
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-12 text-center relative overflow-hidden">
            <div className="relative inline-block">
              {/* Cake */}
              <div
                className={`text-9xl transition-all duration-500 ${
                  isCut ? 'scale-90 opacity-70' : 'scale-100'
                }`}
              >
                {selectedCakeData?.emoji}
              </div>

              {/* Candle */}
              {!isCut && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="text-4xl">🕯️</div>
                  {candleLit && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl animate-glow-pulse">
                      🔥
                    </div>
                  )}
                </div>
              )}

              {/* Slice (shown when cut) */}
              {isCut && (
                <div className="absolute -right-16 top-8 text-6xl animate-in slide-in-from-left duration-500">
                  🍰
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center mt-8">
              {!isCut && candleLit && (
                <Button
                  onClick={handleBlowCandle}
                  variant="outline"
                  size="lg"
                  className="text-lg"
                >
                  Blow Candle 💨
                </Button>
              )}
              {!isCut && (
                <Button onClick={handleCutCake} size="lg" className="text-lg">
                  Cut Cake 🔪
                </Button>
              )}
              {isCut && (
                <Button
                  onClick={() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 800;
                    canvas.height = 600;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.fillStyle = '#1a1f3a';
                      ctx.fillRect(0, 0, 800, 600);
                      ctx.font = '48px Playfair Display';
                      ctx.fillStyle = '#F4E4C1';
                      ctx.textAlign = 'center';
                      ctx.fillText('Happy 20th Birthday, Afrah! 🎂', 400, 300);
                    }
                    const link = document.createElement('a');
                    link.download = 'afrah-birthday-cake.png';
                    link.href = canvas.toDataURL();
                    link.click();
                    toast({
                      title: "Photo saved!",
                      description: "Your birthday moment is captured! 📸",
                    });
                  }}
                  variant="outline"
                  size="lg"
                >
                  Take Photo 📸
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
