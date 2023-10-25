/* eslint-disable */
import { Float, Sphere, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

import { useFocusCamera } from './hooks/use-focus-camera'
import { Atom } from './Atom';
import { useEffect } from 'react';
import { Clock } from 'three';
import { CameraAnimationHandler } from './Camera';

const FloatingAtom = () => {
  return (
    <>
      <Float speed={20} rotationIntensity={1} floatIntensity={2}>
        <Atom />
      </Float>
    </>
  );
};

let toggleCamerView = false
export default function Scene() {

  const { focusPosition } = useFocusCamera()

  const onKeyPress = (key: string) => {
    if (key === 'p') {
      toggleCamerView = !toggleCamerView
      if (!toggleCamerView) {
        focusPosition(0.4, [0, 0, 0])
      } else {
        focusPosition(1.2, [0, 3, 10])
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', (event) => onKeyPress(event.key));
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 20] }}>
      <CameraAnimationHandler />
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
