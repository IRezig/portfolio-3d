import { Float } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';
import { Atom } from './Atom';

export const Ball = () => {
  const ref = useRef<Group>(null);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    exposeObject('ball', ref);
  }, []);

  return (
    <group ref={ref} {...{ position: config.initialBallPosition }}>
      <Float speed={20} rotationIntensity={0.04} floatIntensity={2}>
        <Atom />
      </Float>
    </group>
  );
};
