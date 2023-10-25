import { Camera } from '@react-three/fiber';
import { Clock, Vector3 } from 'three';

import { useSceneContext } from '../context/scene-context';

interface AnimProperties {
  look: {
    start: Vector3;
    end: Vector3;
  };
  position: {
    start: Vector3;
    end: Vector3;
  };
  clock: Clock;
  duration: number;
  callback?: () => void;
}

const cam = {
  pos: new Vector3(0, 0, 0),
  look: new Vector3(0, 0, 0),
  focused: false,
};
let camBeforeFocus: typeof cam | null = null;
let focusAnim: AnimProperties | null = null;

export const useCameraHandler = () => {
  const { objects } = useSceneContext();
  const isFocused = () => cam.focused;

  const getPlayerPos = () => {
    const player = objects.player;
    if (!player?.current) {
      return null;
    }
    return player.current.position;
  };

  const focusObject = (target: Vector3) => {
    cam.focused = true;
    camBeforeFocus = cam;
    const playerPos = getPlayerPos();
    if (playerPos) {
      focusPosition(1.2, target, playerPos);
    }
  };

  const unfocusObject = () => {
    const playerPos = getPlayerPos();
    if (camBeforeFocus && playerPos) {
      focusPosition(0.7, playerPos, camBeforeFocus.pos, () => {
        cam.focused = false;
      });
    }
  };

  const focusPosition = (
    duration: number,
    look: Vector3,
    pos: Vector3,
    callback?: () => void,
  ) => {
    focusAnim = {
      look: {
        start: cam.look,
        end: look,
      },
      position: {
        start: cam.pos,
        end: pos,
      },
      clock: new Clock(),
      duration,
      callback,
    };
  };

  const syncLook = (look: Vector3) => {
    cam.look = look;
  };
  const syncPosition = (pos: Vector3) => {
    cam.pos = pos;
  };

  const runAnimationFrame = (camera: Camera) => {
    if (!focusAnim) {
      return null;
    }
    const { look, clock, duration, callback } = focusAnim;
    const diff = {
      x: look.end.x - look.start.x,
      y: look.end.y - look.start.y,
      z: look.end.z - look.start.z,
    };
    const progress = clock.getElapsedTime() / duration;
    const calcLook = (n: number, diff: number) => n + diff * progress;
    cam.look = new Vector3(
      calcLook(look.start.x, diff.x),
      calcLook(look.start.y, diff.y),
      calcLook(look.start.z, diff.z),
    );

    if (progress <= 1) {
      camera.lookAt(cam.look.x, cam.look.y, cam.look.z);
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
    syncPosition,
  };
};
