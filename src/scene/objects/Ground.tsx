import { Plane } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Euler, MeshPhongMaterial } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';

export const Ground = () => {
  const materialRef = useRef<MeshPhongMaterial>(null);
  const groundRotation = new Euler(-Math.PI / 2, 0, 0);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exposeObject('ground', materialRef as any);
  }, []);

  return (
    <Plane
      receiveShadow
      castShadow
      args={[1000, 1000]}
      rotation={groundRotation}
      position={[0, 0, 0]}
    >
      <meshPhongMaterial
        ref={materialRef}
        attach={'material'}
        color={config.scene.groundColor}
      />
    </Plane>
  );
};
