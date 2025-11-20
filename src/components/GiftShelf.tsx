import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { saveProgress, loadProgress } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface Gift {
  id: string;
  emoji: string;
  title: string;
  type: 'text' | 'video' | 'audio' | 'gallery';
  content: any;
}

const GIFTS: Gift[] = [
  {
    id: 'letter1',
    emoji: '💌',
    title: 'A Letter of Love',
    type: 'text',
    content: {
      text: `Dear Afrah,\n\nHappy 20th Birthday! 🎉\n\nAs you step into this new decade, remember that you are loved beyond measure. Your kindness, strength, and beautiful spirit light up every room you enter.\n\nMay this year bring you endless joy, unforgettable adventures, and dreams come true.\n\nWith all my love,\nYour biggest fan ❤️`
    }
  },
  {
    id: 'memories',
    emoji: '📸',
    title: 'Memory Gallery',
    type: 'gallery',
    content: {
      images: ['🌅', '🎈', '🌸', '⭐', '🎨', '🌺']
    }
  },
  {
    id: 'music',
    emoji: '🎵',
    title: 'Birthday Melody',
    type: 'audio',
    content: {
      message: '🎶 Your favorite birthday song 🎶'
    }
  },
  {
    id: 'video',
    emoji: '🎬',
    title: 'Video Message',
    type: 'video',
    content: {
      message: '🎥 A special video message just for you! 🎥'
    }
  },
  {
    id: 'wishes',
    emoji: '🌟',
    title: 'Birthday Wishes',
    type: 'text',
    content: {
      text: `20 Wishes for Your 20th:\n\n1. May you always find reasons to smile\n2. May your dreams take flight\n3. May love surround you always\n4. May you discover new passions\n5. May courage guide your steps\n6. May laughter fill your days\n7. May peace be in your heart\n8. May adventure call your name\n9. May kindness be your compass\n10. May success follow your efforts\n11. May creativity flow through you\n12. May friendships grow deeper\n13. May health bless your body\n14. May wisdom light your path\n15. May joy be your companion\n16. May gratitude fill your soul\n17. May strength carry you forward\n18. May hope never fade\n19. May love multiply around you\n20. May this year be your best yet! 🎊`
    }
  },
  {
    id: 'easter-egg',
    emoji: '🎁',
    title: 'Mystery Gift',
    type: 'text',
    content: {
      text: `🎉 Surprise! 🎉\n\nYou found the secret gift!\n\nHere's a special bonus:\n\n✨ You are amazing ✨\n✨ You are loved ✨\n✨ You are capable of anything ✨\n\nNever forget how special you are! 💖`
    }
  }
];

export const GiftShelf = () => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [openedGifts, setOpenedGifts] = useState<string[]>(() => {
    return loadProgress().giftsOpened || [];
  });
  const { toast } = useToast();

  const handleGiftClick = (gift: Gift) => {
    setSelectedGift(gift);
    
    if (!openedGifts.includes(gift.id)) {
      const updated = [...openedGifts, gift.id];
      setOpenedGifts(updated);
      saveProgress({ giftsOpened: updated });
      
      toast({
        title: "Gift opened!",
        description: gift.title,
        duration: 2000,
      });
    }
  };

  const renderGiftContent = (gift: Gift) => {
    switch (gift.type) {
      case 'text':
        return (
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {gift.content.text}
          </div>
        );
      
      case 'gallery':
        return (
          <div className="grid grid-cols-3 gap-4">
            {gift.content.images.map((img: string, i: number) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg flex items-center justify-center text-6xl"
              >
                {img}
              </div>
            ))}
          </div>
        );
      
      case 'audio':
      case 'video':
        return (
          <div className="text-center py-8">
            <p className="text-4xl mb-4">{gift.content.message}</p>
            <p className="text-sm text-muted-foreground">
              {gift.type === 'audio' ? '(Audio player placeholder)' : '(Video player placeholder)'}
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="max-w-5xl w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-champagne mb-4">
            Gift Shelf
          </h2>
          <p className="text-muted-foreground">
            {openedGifts.length} of {GIFTS.length} gifts opened
          </p>
        </div>

        {/* Gift boxes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {GIFTS.map(gift => {
            const isOpened = openedGifts.includes(gift.id);
            
            return (
              <button
                key={gift.id}
                onClick={() => handleGiftClick(gift)}
                className={`relative aspect-square rounded-lg transition-all duration-500 ${
                  isOpened
                    ? 'bg-primary/20 border-2 border-primary animate-glow-pulse'
                    : 'bg-card border-2 border-border hover:border-primary/50 hover:scale-105'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  {gift.emoji}
                </div>
                {isOpened && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Gift modal */}
        <Dialog open={!!selectedGift} onOpenChange={() => setSelectedGift(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-playfair flex items-center gap-3">
                <span className="text-4xl">{selectedGift?.emoji}</span>
                {selectedGift?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6">
              {selectedGift && renderGiftContent(selectedGift)}
            </div>
            <div className="mt-6 text-center">
              <Button onClick={() => setSelectedGift(null)} size="lg">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
