import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

import { FocusAnimationStore } from '../animation/focus-camera-animation';
import { useSceneContext } from '../context/scene-context';

export const useCameraAnimation = () => {
  const { camera } = useThree();
  const { objects } = useSceneContext();
  const focused = useRef(false);

  const _getPlayerPos = () => {
    const player = objects.player?.current;
    return player?.position.clone() ?? new Vector3(0, 0, 0);
  };

  const animStore = useRef(new FocusAnimationStore());

  const focusObject = (targetPos: Vector3) => {
    focused.current = true;
    animStore.current.start(targetPos, _getPlayerPos(), camera.position);
  };

  const unfocusObject = () => {
    focused.current = false;
    animStore.current.rollback();
  };

  const runFocusAnimation = () => {
    if (focused.current) {
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
  };

  /**
   * Animation helpers
   */

  return {
    focused,
    focusObject,
    unfocusObject,
    runFocusAnimation,
  };
};
