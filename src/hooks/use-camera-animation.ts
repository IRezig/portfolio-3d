import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

import { FocusAnimationStore } from '../animation/focus-camera-animation';
import { useSceneContext } from '../context/scene-context';

export const useCameraAnimation = () => {
  const { camera } = useThree();
  const { objects } = useSceneContext();
  const animStore = useRef(new FocusAnimationStore(camera));

  useEffect(() => {
    if (objects.playerCannon?.current) {
      animStore.current.player = objects.playerCannon?.current;
    }
  }, [objects]);

  const isFocused = () => animStore.current.focused;

  const focusObject = (targetPos: Vector3) => {
    const player = objects.playerCannon?.current;
    if (!player) {
      return;
    }
    animStore.current.start(targetPos);
  };

  const unfocusObject = () => {
    animStore.current.rollback();
  };

  useFrame(() => {
    if (animStore.current.focused) {
      // Handle animation
      // ...when it's focused
      animStore.current.run(objects);
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
