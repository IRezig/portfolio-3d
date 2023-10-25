import { useKeyPress } from './use-key-press';

export const usePlayerHandler = () => {
  useKeyPress(({ key }: KeyboardEvent) => {
    if (key === 'ArrowUp') {
      console.log('Up pressed');
    }
  });
};
