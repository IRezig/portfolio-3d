import { Clock } from 'three';

let cameraLookAt = [0, 0, 0];
let cameraAnimDuration = 0;
let cameraStart: number[] | null = null;
let cameraEnd: number[] | null = null;
let cameraAnimClock: Clock | null = null;

export const useCameraHandler = () => {
  const focusPosition = (duration: number, pos: number[]) => {
    cameraStart = cameraLookAt;
    cameraEnd = pos;
    cameraAnimDuration = duration;
    cameraAnimClock = new Clock();
  };

  const runAnimation = () => {
    if (!cameraStart || !cameraEnd || !cameraAnimClock) {
      return cameraLookAt;
    }
    const end = cameraEnd;
    const start = cameraStart;
    const diff = end.map((n, index) => n - start[index]);
    const progress = cameraAnimClock.getElapsedTime() / cameraAnimDuration;
    cameraLookAt = cameraStart.map((n, index) => n + diff[index] * progress);
    if (progress >= 1) {
      cameraStart = null;
      cameraEnd = null;
      cameraAnimClock = null;
    }

    return cameraLookAt;
  };

  return {
    focusPosition,
    runAnimation,
  };
};
