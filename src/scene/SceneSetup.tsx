import { Stars } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

export const SceneSetup = () => {
  return (
    <>
      {/* Background Color */}
      <color
        {...{
          attach: 'background',
          args: ['black'],
        }}
      />

      {/* Background Ambiance */}
      <Stars saturation={0} count={400} speed={0.5} />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1.4} radius={0.4} />
      </EffectComposer>
    </>
  );
};
