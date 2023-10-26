import { Stars } from '@react-three/drei';

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

      {/* Background Ambiance */}
      <Stars saturation={0} count={400} speed={0.5} />

      {/* Post-processing effects */}
      {/* <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1.4} radius={0.4} />
      </EffectComposer>
      <Environment preset="city" background blur={0.7} /> */}
    </>
  );
};
