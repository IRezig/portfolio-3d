import { useThree } from '@react-three/fiber';
import { Vector3, VectorKeyframeTrack } from 'three';

import { useSceneContext } from '../context/scene-context';
import { useAnimationClip } from './use-animation-clip';

const cam: {
  pos: Vector3 | null;
  focused: boolean;
} = {
  pos: new Vector3(0, 0, 0),
  focused: false,
};

export const useCameraHandler = () => {
  const { camera } = useThree();
  const { objects } = useSceneContext();
  const isFocused = () => cam.focused;
  const { animate: unfocusAnim } = useAnimationClip('CameraUnfocus', camera, () => {
    cam.focused = false;
    camera.lookAt(_getPlayerPos());
  });
  const { animate: focusAnim } = useAnimationClip('CameraFocus', camera);

  /**
   * Focus animation
   */
  const focusObject = (targetLook: Vector3) => {
    cam.focused = true;
    cam.pos = camera.position.clone();
    camera.lookAt(targetLook);
    const playerPos = _getPlayerPos();
    const vec = new Vector3().subVectors(targetLook, playerPos).normalize();
    const offset = vec.multiplyScalar(-20);
    const targetPosition = new Vector3().addVectors(playerPos, offset);
    const upwardOffset = new Vector3(14, 14, 0);
    const finalPosition = new Vector3().addVectors(targetPosition, upwardOffset);
    const focusTracks = new VectorKeyframeTrack(
      '.position',
      [0, 1.2],
      [...cam.pos, ...finalPosition],
    );
    focusAnim(1.2, [focusTracks]);
  };

  const unfocusObject = () => {
    if (!cam.pos) {
      return;
    }
    const unfocusTracks = new VectorKeyframeTrack(
      '.position',
      [0, 0.7],
      [...camera.position, ...cam.pos],
    );
    unfocusAnim(0.7, [unfocusTracks]);
    cam.pos = null;
  };

  const _getPlayerPos = () => {
    const player = objects.player?.current;
    return player?.position.clone() ?? new Vector3(0, 0, 0);
  };

  const runCameraFrame = () => {
    if (cam.focused) {
      // Handle animation
      // ...when it's focused
    } else {
      // Sync up camera from other logic
      // ...while it's not focused
      cam.pos = camera.position.clone();
      camera.lookAt(_getPlayerPos());
    }
  };

  return {
    focusObject,
    unfocusObject,
    runCameraFrame,
    isFocused,
  };
};
