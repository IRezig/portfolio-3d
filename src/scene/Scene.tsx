/* eslint-disable */
import { Float, Plane, Sphere, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

import { useCameraHandler, useFocusCamera } from '../hooks/use-camera-handler';
import { Atom } from './Atom';
import { useEffect } from 'react';
import { CameraAnimationHandler } from './Camera';
import { Euler } from 'three';

const FloatingAtom = () => {
  return (
    <>
      <Float speed={20} rotationIntensity={1} floatIntensity={2}>
        <Atom />
      </Float>
    </>
  );
};

let toggleCamerView = false;
export default function Scene() {
  const { focusPosition } = useCameraHandler();

  const onKeyPress = (key: string) => {
    if (key === 'p') {
      toggleCamerView = !toggleCamerView;
      if (!toggleCamerView) {
        focusPosition(0.4, [0, 0, 0]);
      } else {
        focusPosition(1.2, [0, 3, 10]);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', (event) => onKeyPress(event.key));
  }, []);

  const groundRotation = new Euler(30, 0, 0);

  return (
    <Canvas camera={{ position: [0, 0, 20] }}>
      <CameraAnimationHandler />
      <color attach="background" args={['black']} />
      <group position={[0, 3, 10]}>
        <Sphere args={[0.55]}>
          <meshBasicMaterial color={[6, 0.5, 2]} />
        </Sphere>
      </group>
      <Plane args={[100, 100]} rotation={groundRotation} position={[0, -20, 0]}>
        <meshBasicMaterial color={[6, 0.5, 2]} />
      </Plane>
      <group>
        <FloatingAtom />
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
        </EffectComposer>
      </group>
      <Stars saturation={0} count={400} speed={0.5} />
    </Canvas>
  );
}
