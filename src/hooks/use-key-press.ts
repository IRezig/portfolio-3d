import { useEffect } from 'react';

export const useKeyPress = (callback: (key: KeyboardEvent) => void) => {
  useEffect(() => {
    document.addEventListener('keydown', callback);

    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [callback]);
};
