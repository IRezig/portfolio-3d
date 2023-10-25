/* eslint-disable */
import { Float, Plane, Sphere } from '@react-three/drei';
import { Euler } from 'three';

import { Atom } from './Atom';

export const SceneObjects = () => {
  const groundRotation = new Euler(30, 0, 0);

  return (
    <>
      <group position={[0, 3, 10]}>
        <Sphere args={[0.55]}>
          <meshBasicMaterial color={[6, 0.5, 2]} />
        </Sphere>
      </group>

      <Plane args={[100, 100]} rotation={groundRotation} position={[0, -20, 0]}>
        <meshBasicMaterial color={[6, 0.5, 2]} />
      </Plane>

      <Float speed={20} rotationIntensity={1} floatIntensity={2}>
        <Atom />
      </Float>
    </>
  );
};
