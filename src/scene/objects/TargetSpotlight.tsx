import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Object3D, Vector3 } from 'three';

import { angleToRad } from '../../services/vector-helpers';

export const TargetSpotlight = ({ targetPosition }: { targetPosition: Vector3 }) => {
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
