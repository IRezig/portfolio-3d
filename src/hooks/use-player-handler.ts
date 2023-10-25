import { useFrame } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import { Group } from 'three';

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
  useKeyDown(({ key }: KeyboardEvent) => {
    if (keys.xAxis[key]) {
      directionX = keys.xAxis[key];
    }
    if (keys.zAxis[key]) {
      directionZ = keys.zAxis[key];
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
      ref.current.position.x += directionX * 1;
      ref.current.position.z += directionZ * 1;
      camera.position.x += directionX * 1;
      camera.position.z += directionZ * 1;
    }
  });
};
