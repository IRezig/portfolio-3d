import { usePlane } from '@react-three/cannon';
import { Plane } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { MeshPhongMaterial } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';

export const Ground = () => {
  const materialRef = useRef<MeshPhongMaterial>(null);
  const { exposeObject } = useSceneContext();
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exposeObject('ground', materialRef as any);
  }, []);

  return (
    <Plane receiveShadow castShadow args={[1000, 1000]} ref={groundRef}>
      <meshPhongMaterial
        ref={materialRef}
        attach={'material'}
        color={config.scene.groundColor}
      />
    </Plane>
  );
};
