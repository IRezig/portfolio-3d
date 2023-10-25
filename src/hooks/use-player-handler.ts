import { useFrame } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import { Group } from 'three';

import { useCameraHandler } from './use-camera-handler';
import { useKeyDown, useKeyUp } from './use-key-press';

let directionX = 0;
let directionZ = 0;

const keys: Record<string, Record<string, number>> = {
  xAxis: {
    ArrowRight: 1,
    ArrowLeft: -1,
  },
  zAxis: {
    ArrowDown: 1,
    ArrowUp: -1,
  },
};

export const usePlayerHandler = (ref: MutableRefObject<Group | undefined | null>) => {
  const { isFocused, runAnimationFrame, unfocusObject, focusObject, syncLook } =
    useCameraHandler();

  useKeyDown(({ key }: KeyboardEvent) => {
    if (keys.xAxis[key]) {
      directionX = keys.xAxis[key];
    }
    if (keys.zAxis[key]) {
      directionZ = keys.zAxis[key];
    }
    if (key === 'p') {
      if (isFocused()) {
        unfocusObject();
      } else {
        focusObject([0, 3, 10]);
      }
    }
  });

  useKeyUp(({ key }: KeyboardEvent) => {
    if (keys.xAxis[key]) {
      directionX = 0;
    }
    if (keys.zAxis[key]) {
      directionZ = 0;
    }
  });

  useFrame(({ camera }) => {
    if (ref.current) {
      if (isFocused()) {
        // Handle camera focus
        const res = runAnimationFrame();
        if (res) {
          const [x, y, z] = res;
          camera.lookAt(x, y, z);
        }
      } else {
        // Handle player movement
        ref.current.position.x += directionX * 1;
        ref.current.position.z += directionZ * 1;
        camera.position.x += directionX * 1;
        camera.position.z += directionZ * 1;
        syncLook(ref.current.position.toArray());

        camera.lookAt(
          ref.current.position.x,
          ref.current.position.y,
          ref.current.position.z,
        );
      }
    }
  });
};
