import { Camera } from '@react-three/fiber';
import { Clock, Vector3 } from 'three';

interface AnimProperties {
  startLook: Vector3;
  endLook: Vector3;
  clock: Clock;
  duration: number;
  callback?: () => void;
}

let cameraLookAt = new Vector3(0, 0, 0);
let focused = false;
let focusAnim: AnimProperties | null = null;
let previousPosition: Vector3 | null = null;

export const useCameraHandler = () => {
  const isFocused = () => focused;

  const focusObject = (position: Vector3) => {
    focused = true;
    previousPosition = cameraLookAt;
    focusPosition(1.2, position);
  };

  const unfocusObject = () => {
    if (previousPosition) {
      focusPosition(0.7, previousPosition, () => {
        focused = false;
      });
    }
  };

  const focusPosition = (duration: number, pos: Vector3, callback?: () => void) => {
    focusAnim = {
      startLook: cameraLookAt,
      endLook: pos,
      clock: new Clock(),
      duration,
      callback,
    };
  };

  const syncLook = (pos: Vector3) => {
    cameraLookAt = pos;
  };

  const runAnimationFrame = (camera: Camera) => {
    if (!focusAnim) {
      return null;
    }
    const { startLook, endLook, clock, duration, callback } = focusAnim;
    const diff = {
      x: endLook.x - startLook.x,
      y: endLook.y - startLook.y,
      z: endLook.z - startLook.z,
    };
    const progress = clock.getElapsedTime() / duration;
    const calcLook = (n: number, diff: number) => n + diff * progress;
    cameraLookAt = new Vector3(
      calcLook(startLook.x, diff.x),
      calcLook(startLook.y, diff.y),
      calcLook(startLook.z, diff.z),
    );

    if (progress <= 1) {
      camera.lookAt(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
    } else {
      focusAnim = null;
      if (callback) {
        callback();
      }
    }
  };

  return {
    focusObject,
    unfocusObject,
    runAnimationFrame,
    isFocused,
    syncLook,
  };
};
