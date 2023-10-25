import { Clock } from 'three';

interface AnimProperties {
  start: number[];
  end: number[];
  clock: Clock;
  duration: number;
  callback?: () => void;
}

let cameraLookAt = [0, 0, 0];
let focused = false;
let currentAnim: AnimProperties | null = null;
let previousPosition: number[] | null = null;

export const useCameraHandler = () => {
  const isFocused = () => focused;

  const focusObject = (position: number[]) => {
    focused = true;
    previousPosition = cameraLookAt;
    focusPosition(1.2, position);
    console.log('focusing to', position);
  };

  const unfocusObject = () => {
    if (previousPosition) {
      console.log('unfocusing to', previousPosition);
      focusPosition(0.7, previousPosition, () => {
        focused = false;
      });
    }
  };

  const focusPosition = (duration: number, pos: number[], callback?: () => void) => {
    currentAnim = {
      start: cameraLookAt,
      end: pos,
      clock: new Clock(),
      duration,
      callback,
    };
  };

  const syncLook = (pos: number[]) => {
    cameraLookAt = pos;
  };

  const runAnimationFrame = () => {
    if (!currentAnim) {
      return null;
    }
    const { start, end, clock, duration, callback } = currentAnim;
    const diff = end.map((n, index) => n - start[index]);
    const progress = clock.getElapsedTime() / duration;
    cameraLookAt = start.map((n, index) => n + diff[index] * progress);
    if (progress >= 1) {
      currentAnim = null;
      if (callback) {
        callback();
      }
    }

    return cameraLookAt;
  };

  return {
    focusObject,
    unfocusObject,
    runAnimationFrame,
    isFocused,
    syncLook,
  };
};
