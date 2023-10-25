import { useFrame } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import { Group } from 'three';

import { useMenuContext } from '../context/menu-context';
import { useSceneContext } from '../context/scene-context';
import { useCameraHandler } from './use-camera-handler';
import { useKeyDown, useKeyUp } from './use-key-press';

const SPACE_KEY = ' ';

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
  const { objects } = useSceneContext();
  const { shown: menuShown, showMenu } = useMenuContext();

  useKeyDown(({ key }: KeyboardEvent) => {
    // Handle movements
    if (keys.xAxis[key]) {
      directionX = keys.xAxis[key];
    }
    if (keys.zAxis[key]) {
      directionZ = keys.zAxis[key];
    }

    console.log(key);

    // Handle focus state
    if (isFocused()) {
      if (key === SPACE_KEY) {
        unfocusObject();
      }
    } else {
      if (key === SPACE_KEY) {
        if (menuShown) {
          const ball = objects.ball;
          if (ball?.current) {
            const position = ball.current.position;
            focusObject(position.toArray());
            showMenu(false);
          }
        } else {
          focusObject([0, 3, 10]);
        }
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

        const ball = objects.ball;
        //console.log('focus on ball', ball?.current?.position);
        if (ball?.current) {
          const position = ball.current.position;
          // Handle focus on ball
          // ... when approaching given distance
          const distWithBall = ref.current.position.distanceTo(position);
          if (distWithBall < 20) {
            showMenu(true);
          } else {
            showMenu(false);
          }
        }
      }
    }
  });
};
