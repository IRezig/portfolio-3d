import { useEffect } from 'react';

export const useKeyUp = (callback: (key: KeyboardEvent) => void) => {
  useEffect(() => {
    document.addEventListener('keyup', callback);

    return () => {
      document.removeEventListener('keyup', callback);
    };
  }, [callback]);
};

export const useKeyDown = (callback: (key: KeyboardEvent) => void) => {
  useEffect(() => {
    document.addEventListener('keydown', callback);

    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [callback]);
};
