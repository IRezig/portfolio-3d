import { Float } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Euler, Group, Vector3 } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';
import { Atom } from '../objects/Atom';
import { TargetSpotlight } from '../objects/TargetSpotlight';
import { Text } from '../objects/Text';

export const ReactNativePlace = () => {
  const ref = useRef<Group>(null);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    exposeObject('ball', ref);
  }, []);

  const origin = config.places.ball.initialPosition;
  const textPos = new Vector3(-16, -origin.y - 0.7, 8);
  const textRotation = new Euler(-Math.PI / 2, 0, 0);
  return (
    <>
      <group ref={ref} position={origin}>
        <Float speed={20} rotationIntensity={0.04} floatIntensity={2}>
          <Atom />
        </Float>
        <Text value={'React-Native'} position={textPos} rotation={textRotation} />
      </group>
      <TargetSpotlight
        distance={120}
        intensity={300}
        targetPosition={new Vector3(origin.x, 20, origin.z)}
      />
    </>
  );
};
