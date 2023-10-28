import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { ColorRepresentation, Object3D, Vector3 } from 'three';

import { angleToRad } from '../../services/vector-helpers';

/**
 * Should not be put into a group
 * ... only absolute positioning at root level
 */
export const TargetSpotlight = ({
  targetPosition,
  color = 'red',
  intensity = 240,
  distance = 100,
}: {
  targetPosition: Vector3;
  color?: ColorRepresentation;
  intensity?: number;
  distance?: number;
}) => {
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
      args={[color, intensity, distance]}
      angle={angleToRad(45)}
      target={target}
      position={targetPosition}
    />
  );
};
