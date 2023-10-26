import { Camera } from '@react-three/fiber';
import { Vector3 } from 'three';

import { useSceneContext } from '../context/scene-context';
import { useAnimation } from './use-animation';

interface FocusAnimData {
  look: {
    start: Vector3;
    end: Vector3;
  };
  position: {
    start: Vector3;
    end: Vector3;
  };
}

const cam = {
  pos: new Vector3(0, 0, 0),
  look: new Vector3(0, 0, 0),
  focused: false,
};
let camBeforeFocus: typeof cam | null = null;

export const useCameraHandler = () => {
  const { start, run } = useAnimation<FocusAnimData>();
  const { objects } = useSceneContext();
  const isFocused = () => cam.focused;

  /**
   * Focus animation
   */
  const focusObject = (target: Vector3) => {
    cam.focused = true;
    camBeforeFocus = cam;
    const playerPos = _getPlayerPos();
    if (playerPos) {
      _animateTo(1.2, target, playerPos);
    }
  };

  const unfocusObject = () => {
    const playerPos = _getPlayerPos();
    if (camBeforeFocus && playerPos) {
      _animateTo(0.7, playerPos, camBeforeFocus.pos, () => {
        cam.focused = false;
      });
    }
  };

  const runCameraFrame = (camera: Camera) => {
    if (cam.focused) {
      // Handle animation
      // ...when it's focused
      run((data, progress) => {
        const diff = {
          x: data.look.end.x - data.look.start.x,
          y: data.look.end.y - data.look.start.y,
          z: data.look.end.z - data.look.start.z,
        };
        const applyProgress = (n: number, diff: number) => n + diff * progress;
        cam.look = new Vector3(
          applyProgress(data.look.start.x, diff.x),
          applyProgress(data.look.start.y, diff.y),
          applyProgress(data.look.start.z, diff.z),
        );

        camera.lookAt(cam.look.x, cam.look.y, cam.look.z);
      });
    } else {
      // Sync up camera from other logic
      // ...while it's not focused
      cam.pos = camera.position;
      const playerPos = _getPlayerPos();
      if (playerPos) {
        cam.look = playerPos;
      }
    }
  };

  const _getPlayerPos = () => {
    const player = objects.player?.current;
    return player?.position ?? null;
  };

  const _animateTo = (
    duration: number,
    look: Vector3,
    pos: Vector3,
    callback?: () => void,
  ) => {
    start(
      {
        look: {
          start: cam.look,
          end: look,
        },
        position: {
          start: cam.pos,
          end: pos,
        },
      },
      duration,
      callback,
    );
  };

  return {
    focusObject,
    unfocusObject,
    runCameraFrame,
    isFocused,
  };
};
