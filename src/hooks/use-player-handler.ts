import { PublicApi } from '@react-three/cannon';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { AnimationMixer, Group, Vector3 } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import config from '../config/config';
import { useMenuContext } from '../context/menu-context';
import { ObjectType, useSceneContext } from '../context/scene-context';
import { isObjectBehind, isObjectInFov } from '../services/vector-helpers';
import { useCameraAnimation } from './use-camera-animation';
import { useKeyDown, useKeyUp } from './use-key-press';

interface NearestObject {
  distance?: number;
  object?: ObjectType;
}

const SPACE_KEY = ' ';
const orientation = new Vector3(0, 0, 0);
const DISTANCE_RANGE = 40;
const keys: Record<string, Record<string, number>> = {
  xAxis: {
    a: 1,
    e: -1,
  },
  zAxis: {
    ArrowDown: 1,
    ArrowUp: -1,
  },
  yAxis: {
    ArrowRight: -1,
    ArrowLeft: 1,
  },
};

export const usePlayerHandler = (api: PublicApi) => {
  const { objects } = useSceneContext();
  const { shown: menuShown, showMenu } = useMenuContext();
  const { camera } = useThree();
  const { isFocused, unfocusObject, focusObject } = useCameraAnimation(api);
  const isPlaying = useRef(false);
  const nearestObject = useRef<NearestObject>({});
  const fbxWalk = useLoader(FBXLoader, './src/assets/walk.fbx');
  const fbxWalkBack = useLoader(FBXLoader, './src/assets/walk_back.fbx');
  const fbxSideStepRight = useLoader(FBXLoader, './src/assets/side_step_right.fbx');
  const fbxSideStepLeft = useLoader(FBXLoader, './src/assets/side_step_left.fbx');
  const mixer = useRef<AnimationMixer | null>(new AnimationMixer(fbxWalk));

  const focusNearestObject = () => {
    const { distance = DISTANCE_RANGE + 1, object } = nearestObject.current;
    if (object && distance < DISTANCE_RANGE) {
      focusObject(object.position);
      updateMenuState(false);
    }
  };

  const playAnimation = (obj: Group) => {
    if (isFocused() || !mixer.current || isPlaying.current) {
      return;
    }
    const anim = mixer.current.clipAction(obj.animations[0]);
    anim.play();
    isPlaying.current = true;
    return anim;
  };

  const stopAnimation = () => {
    if (!mixer.current || !isPlaying.current) {
      return;
    }
    mixer.current.stopAllAction();
    isPlaying.current = false;
  };

  useKeyDown(({ key }: KeyboardEvent) => {
    // Handle movements
    if (keys.xAxis?.[key]) {
      orientation.x = keys.xAxis[key];
      if (orientation.x > 0) {
        playAnimation(fbxSideStepLeft);
      } else {
        playAnimation(fbxSideStepRight);
      }
    }
    if (keys.zAxis?.[key]) {
      orientation.z = keys.zAxis[key];
      if (orientation.z > 0) {
        playAnimation(fbxWalk);
      } else {
        playAnimation(fbxWalkBack);
      }
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
      stopAnimation();
      orientation.x = 0;
    }
    if (keys.zAxis?.[key]) {
      stopAnimation();
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
      if (
        key === 'playerCannon' ||
        key === 'fog' ||
        key === 'background' ||
        key === 'ground'
      ) {
        continue;
      }

      // Ignore those on the backside
      // ...or outside the FOV
      const object = objects[key]?.current;
      if (
        !object ||
        isObjectBehind(object.position, currentPos, camera.position) ||
        !isObjectInFov(object.position, currentPos, camera.position, 90)
      ) {
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
  };

  // const turn = (degrees: number) => {
  //   return (Math.PI / 180) * degrees;
  // };

  // const getOrientationVector = (rotation: number) => {
  //   return new Vector3(Math.sin(rotation), 0, Math.cos(rotation));
  // };

  // const getOrientationVectorSideways = (rotation: number) => {
  //   return new Vector3(Math.cos(rotation), 0, -Math.sin(rotation));
  // };

  // const getMovementVector = (rotation: number) => {
  //   return getOrientationVector(rotation).add(getOrientationVectorSideways(rotation));
  // };

  const knownRotation = useRef(0);
  const knownPos = useRef(new Vector3());
  api.rotation.subscribe((newRotation) => {
    const rotationY = newRotation[1];
    knownRotation.current = rotationY;
  });

  api.position.subscribe((newPosition) => {
    knownPos.current.set(...newPosition);
  });

  const rotatedMove = (vec: Vector3, rotation: number) => {
    const rX = vec.x * Math.cos(rotation) - vec.z * Math.sin(rotation);
    const rZ = vec.x * Math.sin(rotation) + vec.z * Math.cos(rotation);
    return new Vector3(rX, 0, rZ);
  };

  const normalizeAngle = (angle: number) => {
    if (angle < 0) {
      return 0;
    }
    return angle;
  };

  const movePlayer = (rotation: number) => {
    const step = 50;
    const move = rotatedMove(new Vector3(orientation.x, 0, orientation.z), rotation);
    api.velocity.set(move.x * step, 0, move.z * step);
    api.angularVelocity.set(0, orientation.y, 0);
  };

  const moveCamera = (playerPos: Vector3, rotation: number) => {
    const rotationNorm = normalizeAngle(rotation);
    console.log('norm', rotationNorm);
    const baseRotation = -Math.PI / 2;
    const cameraX =
      playerPos.x - config.camera.distance * Math.cos(rotationNorm + baseRotation);
    const cameraZ =
      playerPos.z - config.camera.distance * Math.sin(rotationNorm + baseRotation);
    const cameraY = playerPos.y + config.camera.height;
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(knownPos.current);
  };

  useFrame((_, delta) => {
    mixer.current?.update(delta);

    if (!isFocused()) {
      const playerPos = knownPos.current;
      const rotation = knownRotation.current;
      movePlayer(rotation);
      moveCamera(playerPos, rotation);
      checkDistances(playerPos);
    }
  });

  return fbxWalk;
};
