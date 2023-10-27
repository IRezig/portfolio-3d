import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Object3D, Vector3 } from 'three';

import config from '../../config/config';

const angleToRad = (degrees: number) => {
  return (Math.PI / 180) * degrees;
};

const SpotlightWithTarget = ({ targetPosition }: { targetPosition: Vector3 }) => {
  const { scene } = useThree();
  const target = useMemo(() => {
    const targetObject = new Object3D();
    targetObject.position.set(targetPosition.x, 0, targetPosition.z);
    scene.add(targetObject);
    return targetObject;
  }, [scene, targetPosition]);

  return (
    <spotLight
      castShadow
      args={['red', 240, 100]}
      angle={angleToRad(45)}
      target={target}
      position={targetPosition}
    />
  );
};

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

      <SpotlightWithTarget
        targetPosition={
          new Vector3(
            config.objects.ball.initialPosition.x,
            20,
            config.objects.ball.initialPosition.z,
          )
        }
      />
    </>
  );
};
