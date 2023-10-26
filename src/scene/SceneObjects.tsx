import { Float, Plane, Sphere } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Euler, Group } from 'three';

import config from '../config/config';
import { useSceneContext } from '../context/scene-context';
import { usePlayerHandler } from '../hooks/use-player-handler';
import { Atom } from './Atom';

const Player = () => {
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

const Ball = () => {
  const ref = useRef<Group>(null);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    exposeObject('ball', ref);
  }, []);

  return (
    <group ref={ref} {...{ position: config.initialBallPosition }}>
      <Float speed={20} rotationIntensity={0.04} floatIntensity={2}>
        <Sphere args={[4]}></Sphere>
      </Float>
    </group>
  );
};

const Ground = () => {
  const groundRotation = new Euler(30, 0, 0);

  return (
    <Plane args={[80, 60]} rotation={groundRotation} position={[0, -20, 0]}>
      <meshBasicMaterial color={[0.3, 0.3, 0.3]} />
    </Plane>
  );
};

export const SceneObjects = () => {
  return (
    <>
      <Ball />
      <Player />
      <Ground />
    </>
  );
};
