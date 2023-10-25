import { Canvas } from '@react-three/fiber';

import { useInteractions } from '../hooks/use-interactions';
import { SceneObjects } from './SceneObjects';
import { SceneSetup } from './SceneSetup';

export default function Scene() {
  useInteractions();

  return (
    <Canvas camera={{ position: [0, 20, 20] }}>
      <SceneObjects />
      <SceneSetup />
    </Canvas>
  );
}
