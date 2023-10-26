import { useRef } from 'react';
import { Clock } from 'three';

interface AnimationType<T> {
  data: T;
  clock: Clock;
  duration: number;
  callback?: () => void;
}

export const useAnimation = <T>() => {
  const animRef = useRef<AnimationType<T> | null>(null);

  const start = (data: T, duration = 1200, callback?: () => void) => {
    animRef.current = {
      data,
      clock: new Clock(),
      duration,
      callback,
    };
  };

  const run = (onProgress: (data: T, progress: number) => void) => {
    if (!animRef.current) {
      return null;
    }
    const { data, clock, duration, callback } = animRef.current;
    const progress = clock.getElapsedTime() / duration;
    if (progress <= 1) {
      onProgress(data, progress);
    } else {
      animRef.current = null;
      callback?.();
    }
  };

  return {
    start,
    run,
    isAnimating: () => animRef.current !== null,
  };
};
