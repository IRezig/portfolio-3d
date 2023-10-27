import { Plane } from '@react-three/drei';
import { Euler } from 'three';

import config from '../../config/config';

export const Ground = () => {
  const groundRotation = new Euler(-Math.PI / 2, 0, 0);

  return (
    <Plane
      receiveShadow
      castShadow
      args={[1000, 1000]}
      rotation={groundRotation}
      position={[0, 0, 0]}
    >
      <meshPhongMaterial attach={'material'} color={config.scene.groundColor} />
    </Plane>
  );
};
