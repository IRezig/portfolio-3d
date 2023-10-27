import { Bloom, EffectComposer } from '@react-three/postprocessing';

export const Effects = () => {
  return (
    <>
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1.4} radius={0.4} />
      </EffectComposer>
    </>
  );
};
