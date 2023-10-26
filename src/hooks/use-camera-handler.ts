import { Camera } from '@react-three/fiber';
import { Vector3 } from 'three';

import { useSceneContext } from '../context/scene-context';
import { diffVectors, mergeVectors } from '../services/vector-helpers';
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
  const focusObject = (targetLook: Vector3) => {
    cam.focused = true;
    camBeforeFocus = { ...cam };
    const playerPos = _getPlayerPos();
    const vec = new Vector3().subVectors(targetLook, playerPos).normalize();
    const offset = vec.multiplyScalar(-20);
    const targetPosition = new Vector3().addVectors(playerPos, offset);
    const upwardOffset = new Vector3(0, 14, 0);
    const finalPosition = new Vector3().addVectors(targetPosition, upwardOffset);
    _animateTo(1.2, targetLook, finalPosition);
  };

  const unfocusObject = () => {
    if (camBeforeFocus) {
      _animateTo(0.7, camBeforeFocus.look, camBeforeFocus.pos, () => {
        cam.focused = false;
      });
      camBeforeFocus = null;
    }
  };

  const runCameraFrame = (camera: Camera) => {
    if (cam.focused) {
      // Handle animation
      // ...when it's focused
      run((data, progress) => {
        _applyLook(data, progress, camera);
        _applyPosition(data, progress, camera);
      });
    } else {
      // Sync up camera from other logic
      // ...while it's not focused
      cam.pos = camera.position.clone();
      cam.look = _getPlayerPos();
    }
  };

  /**
   * Animation helpers
   */
  const _applyLook = (data: FocusAnimData, progress: number, camera: Camera) => {
    const diff = diffVectors(data.look.end, data.look.start);
    const applyProgress = (n: number, d: number) => n + d * progress;
    cam.look = mergeVectors(data.look.start, diff, applyProgress);
    camera.lookAt(cam.look.x, cam.look.y, cam.look.z);
  };

  const _applyPosition = (data: FocusAnimData, progress: number, camera: Camera) => {
    const diff = diffVectors(data.position.end, data.position.start);
    const applyProgress = (n: number, d: number) => n + d * progress;
    cam.pos = mergeVectors(data.position.start, diff, applyProgress);
    camera.position.set(cam.pos.x, cam.pos.y, cam.pos.z);
  };

  const _getPlayerPos = () => {
    const player = objects.player?.current;
    return player?.position ?? new Vector3(0, 0, 0);
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
          start: cam.look.clone(),
          end: look,
        },
        position: {
          start: cam.pos.clone(),
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
