// LocalStorage utilities for persisting game progress

export interface GameProgress {
  currentStep: number;
  completedAt?: string;
  cakeCut: boolean;
  candlesBlown: boolean;
  giftsOpened: string[];
}

const STORAGE_KEY = 'afrah-birthday-progress';

export const loadProgress = (): GameProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  
  return {
    currentStep: 0,
    cakeCut: false,
    candlesBlown: false,
    giftsOpened: [],
  };
};

export const saveProgress = (progress: Partial<GameProgress>) => {
  try {
    const current = loadProgress();
    const updated = { ...current, ...progress };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
};

export const markStepComplete = (step: number) => {
  saveProgress({ currentStep: step });
};

export const markGameComplete = () => {
  saveProgress({ 
    currentStep: 20, 
    completedAt: new Date().toISOString() 
  });
};
