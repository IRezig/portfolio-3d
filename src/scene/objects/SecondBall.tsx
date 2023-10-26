import { Float } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';
import { Atom } from './Atom';

export const SecondBall = () => {
  const ref = useRef<Group>(null);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    exposeObject('second_ball', ref);
  }, []);

  return (
    <group ref={ref} {...{ position: config.objects.secondBall.initialPosition }}>
      <Float speed={20} rotationIntensity={0.04} floatIntensity={2}>
        <Atom />
      </Float>
    </group>
  );
};
