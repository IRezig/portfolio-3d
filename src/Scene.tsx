/* eslint-disable */
import { Float, Sphere, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

import Atom from './Atom';
import { useEffect } from 'react';
import { Camera } from 'three';

const FloatingAtom = () => {
  return (
    <>
      <Float speed={20} rotationIntensity={1} floatIntensity={2}>
        <Atom />
      </Float>
    </>
  );
};

let cameraLookAt = [0, 0, 0];

const Cam = () => {
  useFrame(({ camera }) => {
    const [x, y, z] = cameraLookAt;
    camera.lookAt(x, y, z);
  });
  return null;
};

export default function Scene() {
  const onKeyPress = (key: string) => {
    if (key === 'p') {
      const oldY = cameraLookAt[1];
      cameraLookAt[1] = oldY === 3 ? 0 : 3;
      cameraLookAt[2] = oldY === 3 ? 0 : 10;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', (event) => onKeyPress(event.key));
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 20] }}>
      <Cam />
      <color attach="background" args={['black']} />
      <group position={[0, 3, 10]}>
        <Sphere args={[0.55]}>
          <meshBasicMaterial color={[6, 0.5, 2]} />
        </Sphere>
      </group>
      <FloatingAtom />
      <Stars saturation={0} count={400} speed={0.5} />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
