import { Float } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';
import { usePlayerHandler } from '../../hooks/use-player-handler';
import { Atom } from './Atom';

export const Player = () => {
  const ref = useRef<Group>(null);
  const { exposeObject } = useSceneContext();
  usePlayerHandler();

  useEffect(() => {
    exposeObject('player', ref);
  }, []);

  return (
    <Float
      position={config.initialPlayerPosition}
      ref={ref}
      speed={20}
      rotationIntensity={0.4}
      floatIntensity={0.8}
    >
      <Atom />
    </Float>
  );
};
