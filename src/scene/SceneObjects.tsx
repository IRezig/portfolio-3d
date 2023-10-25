/* eslint-disable */
import { Float, Plane, Sphere } from '@react-three/drei';
import { Euler } from 'three';

import { Atom } from './Atom';
import { usePlayerHandler } from '../hooks/use-player-handler';

const Player = () => {
  usePlayerHandler();
  
  return (
    <Float speed={20} rotationIntensity={1} floatIntensity={2}>
      <Atom />
    </Float>
  )
}

const Ball = () => {
  return (
    <Float speed={20} rotationIntensity={0.04} floatIntensity={2}>
      <group position={[0, 3, 10]}>
        <Sphere args={[0.55]}>
          <meshBasicMaterial color={[6, 0.5, 2]} />
        </Sphere>
      </group>
    </Float>
  )
}

const Ground = () => {
  const groundRotation = new Euler(30, 0, 0);

  return (
    <Plane args={[30, 20]} rotation={groundRotation} position={[0, -20, 0]}>
      <meshBasicMaterial color={[0.3, 0.3, 0.3]} />
    </Plane>
  )
}

export const SceneObjects = () => {
  return (
    <>
      <Ball />
      <Player />
      <Ground />
    </>
  );
};
