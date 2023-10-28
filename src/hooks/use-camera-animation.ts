import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

import { FocusAnimationStore } from '../animation/focus-camera-animation';
import { useSceneContext } from '../context/scene-context';

export const useCameraAnimation = () => {
  const { camera } = useThree();
  const { objects } = useSceneContext();

  const _getPlayerPos = () => {
    const player = objects.player?.current;
    return player?.position.clone() ?? new Vector3(0, 0, 0);
  };

  const animStore = useRef(new FocusAnimationStore());

  const isFocused = () => animStore.current.focused;

  const focusObject = (targetPos: Vector3) => {
    animStore.current.start(targetPos, _getPlayerPos(), camera.position);
  };

  const unfocusObject = () => {
    animStore.current.rollback();
  };

  useFrame(() => {
    if (animStore.current.focused) {
      // Handle animation
      // ...when it's focused
      animStore.current.run(camera, objects);
    } else {
      // Sync up camera from other logic
      // ...while it's not focused
      animStore.current.state.pos = camera.position.clone();
      animStore.current.state.look = _getPlayerPos();
      camera.lookAt(animStore.current.state.look);
    }
  });

  /**
   * Animation helpers
   */

  return {
    isFocused,
    focusObject,
    unfocusObject,
  };
};
