import { useKeyPress } from './use-key-press';

export const useInteractions = () => {
  useKeyPress(({ key }: KeyboardEvent) => {
    if (key === 'ArrowUp') {
      console.log('Up pressed');
    }
  });
};
