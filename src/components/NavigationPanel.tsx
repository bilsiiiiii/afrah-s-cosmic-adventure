import { Button } from '@/components/ui/button';

interface NavigationPanelProps {
  onNavigate: (section: string) => void;
}

export const NavigationPanel = ({ onNavigate }: NavigationPanelProps) => {
  const sections = [
    { id: 'ladder', label: 'Ladder', emoji: '🪜' },
    { id: 'cake', label: 'Cake', emoji: '🎂' },
    { id: 'gifts', label: 'Gifts', emoji: '🎁' },
  ];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {sections.map(section => (
        <Button
          key={section.id}
          onClick={() => onNavigate(section.id)}
          variant="secondary"
          size="lg"
          className="flex flex-col items-center gap-1 h-auto py-3 px-4 interactive-glow"
          title={section.label}
        >
          <span className="text-2xl">{section.emoji}</span>
          <span className="text-xs">{section.label}</span>
        </Button>
      ))}
    </div>
  );
};
