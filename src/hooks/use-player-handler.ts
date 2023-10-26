import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

import config from '../config/config';
import { useMenuContext } from '../context/menu-context';
import { ObjectType, useSceneContext } from '../context/scene-context';
import { useCameraHandler } from './use-camera-handler';
import { useKeyDown, useKeyUp } from './use-key-press';

interface NearestObject {
  distance?: number;
  object?: ObjectType;
}

const SPACE_KEY = ' ';

const orientation = new Vector3(0, 0, 0);

const keys: Record<string, Record<string, number>> = {
  /*xAxis: {
    ArrowRight: 1,
    ArrowLeft: -1,
  },*/
  zAxis: {
    ArrowDown: -1,
    ArrowUp: 1,
  },
  yAxis: {
    ArrowRight: -1,
    ArrowLeft: 1,
  },
};

const DISTANCE_RANGE = 20;

export const usePlayerHandler = () => {
  const { isFocused, runCameraFrame, unfocusObject, focusObject } = useCameraHandler();
  const { objects } = useSceneContext();
  const { shown: menuShown, showMenu } = useMenuContext();
  const nearestObject = useRef<NearestObject>({});

  const focusNearestObject = () => {
    const { distance = DISTANCE_RANGE + 1, object } = nearestObject.current;
    if (object && distance < DISTANCE_RANGE) {
      focusObject(object.position);
      updateMenuState(false);
    }
  };

  useKeyDown(({ key }: KeyboardEvent) => {
    // Handle movements
    if (keys.xAxis?.[key]) {
      orientation.x = keys.xAxis[key];
    }
    if (keys.zAxis?.[key]) {
      orientation.z = keys.zAxis[key];
    }
    if (keys.yAxis?.[key]) {
      orientation.y = keys.yAxis[key];
    }

    // Handle focus state
    if (isFocused()) {
      if (key === SPACE_KEY) {
        unfocusObject();
      }
    } else {
      if (key === SPACE_KEY) {
        focusNearestObject();
      }
    }
  });

  useKeyUp(({ key }: KeyboardEvent) => {
    if (keys.xAxis?.[key]) {
      orientation.x = 0;
    }
    if (keys.zAxis?.[key]) {
      orientation.z = 0;
    }
    if (keys.yAxis?.[key]) {
      orientation.y = 0;
    }
  });

  const updateMenuState = (show: boolean) => {
    if (menuShown && !show) {
      showMenu(false);
    } else if (!menuShown && show) {
      showMenu(true);
    }
  };

  const checkDistances = (currentPos: Vector3) => {
    let check: NearestObject = {
      distance: undefined,
      object: undefined,
    };
    for (const key in objects) {
      if (key === 'player') {
        continue;
      }
      const object = objects[key]?.current;
      if (!object) {
        continue;
      }
      const distance = currentPos.distanceTo(object.position);
      const { distance: minDistance } = check;
      if (minDistance === undefined || distance < minDistance) {
        check = {
          distance,
          object: object,
        };
      }
    }
    nearestObject.current = check;
    const { distance = DISTANCE_RANGE + 1 } = nearestObject.current;
    updateMenuState(distance < DISTANCE_RANGE);
    console.log(distance < DISTANCE_RANGE);
  };

  const turn = (degrees: number) => {
    return (Math.PI / 180) * degrees;
  };

  const getOrientationVector = (rotation: number) => {
    return new Vector3(Math.sin(rotation), 0, Math.cos(rotation));
  };

  useFrame(({ camera }) => {
    // Handle player movement
    if (!isFocused()) {
      const player = objects.player?.current;
      if (!player) {
        return;
      }
      // Turn player
      player.rotation.y += turn(orientation.y);

      // Calculate "forward" vector
      // ...then apply to player and camera
      const forward = getOrientationVector(player.rotation.y);
      player.position.add(forward.clone().multiplyScalar(orientation.z));
      camera.position.add(forward.clone().multiplyScalar(orientation.z));

      // Keep camera behind the player
      if (orientation.y !== 0) {
        const offset = forward.clone().multiplyScalar(-config.camera.distance);
        const camPos = player.position.clone();
        camPos.y = config.camera.height;
        camera.position.copy(camPos).add(offset);
      }

      checkDistances(player.position);
    }

    // Handle camera
    runCameraFrame();
  });
};
