import { Float, Sphere } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';

export const Ball = () => {
  const ref = useRef<Group>(null);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    exposeObject('ball', ref);
  }, []);

  return (
    <group ref={ref} {...{ position: config.initialBallPosition }}>
      <Float speed={20} rotationIntensity={0.04} floatIntensity={2}>
        <Sphere args={[4]}>
          <meshBasicMaterial color={'#888'} />
        </Sphere>
      </Float>
    </group>
  );
};
