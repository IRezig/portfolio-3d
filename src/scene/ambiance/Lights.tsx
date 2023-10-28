import { angleToRad } from '../../services/vector-helpers';

export const Lights = () => {
  return (
    <>
      {/* Light */}
      <directionalLight
        castShadow
        position={[20, 20, 40]}
        color="white"
        intensity={0.4}
        shadow-mapSize-width={10000}
        shadow-mapSize-height={10000}
        shadow-camera-far={400}
        shadow-camera-left={-400}
        shadow-camera-right={400}
        shadow-camera-top={400}
        shadow-camera-bottom={-400}
      />
      <hemisphereLight />

      <spotLight
        castShadow
        args={['white', 820, 40]}
        angle={angleToRad(45)}
        position={[0, 17, 0]}
      />
    </>
  );
};
