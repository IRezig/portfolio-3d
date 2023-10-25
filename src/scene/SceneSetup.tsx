/* eslint-disable */
import { Stars } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

import { CameraAnimationHandler } from './Camera';

export const SceneSetup = () => {
  return (
    <>
      {/* Camera handling */}
      <CameraAnimationHandler />

      {/* Background Color */}
      <color attach="background" args={['black']} />

      {/* Background Ambiance */}
      <Stars saturation={0} count={400} speed={0.5} />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
      </EffectComposer>
    </>
  );
};
