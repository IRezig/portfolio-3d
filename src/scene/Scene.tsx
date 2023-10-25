import { Canvas } from '@react-three/fiber';

import { SceneObjects } from './SceneObjects';
import { SceneSetup } from './SceneSetup';

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 20, 20] }}>
      <SceneObjects />
      <SceneSetup />
    </Canvas>
  );
}
