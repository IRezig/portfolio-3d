import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

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

export const usePlayerHandler = () => {
  const {
    isFocused,
    syncPosition,
    runAnimationFrame,
    unfocusObject,
    focusObject,
    syncLook,
  } = useCameraHandler();
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

    // Handle focus state
    if (isFocused()) {
      if (key === SPACE_KEY) {
        unfocusObject();
      }
    } else {
      if (key === SPACE_KEY) {
        if (menuShown) {
          const ball = objects.ball?.current;
          if (!ball) {
            return;
          }
          const position = ball.position;
          focusObject(position);
          showMenu(false);
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

  const checkDistanceWithBall = (currentPos: Vector3) => {
    const ball = objects.ball?.current;
    if (!ball) {
      return;
    }
    const position = ball.position;
    const distWithBall = currentPos.distanceTo(position);
    if (distWithBall < 20) {
      showMenu(true);
    } else {
      showMenu(false);
    }
  };

  useFrame(({ camera }) => {
    if (isFocused()) {
      // Handle camera focus
      runAnimationFrame(camera);
    } else {
      const player = objects.player?.current;
      if (!player) {
        return;
      }
      // Handle player movement
      player.position.x += directionX * 1;
      player.position.z += directionZ * 1;
      camera.position.x += directionX * 1;
      camera.position.z += directionZ * 1;
      syncLook(player.position);
      syncPosition(camera.position);

      camera.lookAt(player.position.x, player.position.y, player.position.z);

      checkDistanceWithBall(player.position);
    }
  });
};
