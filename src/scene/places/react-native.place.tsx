import { Float } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Euler, Group, Vector3 } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';
import { angleToRad } from '../../services/vector-helpers';
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
  const textPos = new Vector3(-16, 1.1, 8);
  const textRotation = new Euler(-Math.PI / 2, 0, 0);
  return (
    <>
      <group ref={ref} position={origin}>
        <Float speed={20} rotationIntensity={0.04} floatIntensity={2}>
          <Atom position={new Vector3(0, 10, 0)} />
        </Float>
        <group position={new Vector3(0, 2, 0)} rotation={[angleToRad(20), 0, 0]}>
          <Text value={'React-Native'} position={textPos} rotation={textRotation} />
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[38, 4, 24]} />
            <meshStandardMaterial color={'grey'} />
          </mesh>
        </group>
      </group>
      <TargetSpotlight
        distance={210}
        intensity={1200}
        targetPosition={new Vector3(origin.x, 39, origin.z - 10)}
      />
    </>
  );
};
