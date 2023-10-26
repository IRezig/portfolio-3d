import { Bloom, EffectComposer } from '@react-three/postprocessing';

import config from '../config/config';

const angleToRad = (degrees: number) => {
  return (Math.PI / 180) * degrees;
};

export const SceneSetup = () => {
  return (
    <>
      {/* Light */}
      <directionalLight
        castShadow
        position={[-100, 20, -100]}
        color="white"
        intensity={10}
        shadow-mapSize-width={10000}
        shadow-mapSize-height={10000}
        shadow-camera-far={400}
        shadow-camera-left={-400}
        shadow-camera-right={400}
        shadow-camera-top={400}
        shadow-camera-bottom={-400}
      />

      <spotLight
        castShadow
        position={[
          config.objects.ball.initialPosition.x,
          20,
          config.objects.ball.initialPosition.z,
        ]}
        args={['white', 300, 0, angleToRad(90), 1, 1]}
      />

      {/* Background Color */}
      <color
        {...{
          attach: 'background',
          args: ['rgb(224, 192, 172)'],
        }}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1.4} radius={0.4} />
      </EffectComposer>
    </>
  );
};
