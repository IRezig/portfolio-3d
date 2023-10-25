/* eslint-disable */
import { Float, Sphere, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

import Atom from './Atom';

const FloatingAtom = () => {
  return (
    <>
      <Float speed={20} rotationIntensity={1} floatIntensity={2}>
        <Atom />
      </Float>
    </>
  );
};

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 20] }}>
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
