import { Environment } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

export const SceneSetup = () => {
  return (
    <>
      {/* Light */}
      <directionalLight
        castShadow
        color={'#ffffff'}
        position={[-100, 20, -100]}
        intensity={10}
        shadow-mapSize-width={10000}
        shadow-mapSize-height={10000}
        shadow-camera-far={400}
        shadow-camera-left={-400}
        shadow-camera-right={400}
        shadow-camera-top={400}
        shadow-camera-bottom={-400}
      />

      {/* Background Color */}
      <color
        {...{
          attach: 'background',
          args: ['black'],
        }}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1.4} radius={0.4} />
      </EffectComposer>
      <Environment preset="sunset" background blur={0.7} />
    </>
  );
};
