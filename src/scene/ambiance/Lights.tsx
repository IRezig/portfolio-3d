import { angleToRad } from '../../services/vector-helpers';

export const Lights = () => {
  return (
    <>
      {/* Light */}
      <directionalLight
        castShadow
        position={[-100, 20, -100]}
        color="white"
        intensity={1}
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
