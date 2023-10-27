import { useEffect, useRef } from 'react';
import { Group, Mesh } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';
import { usePlayerHandler } from '../../hooks/use-player-handler';

export const Player = () => {
  const ref = useRef<Group>(null);
  const primitiveRef = useRef<Mesh>(null);
  const { exposeObject } = useSceneContext();
  const scale = 0.1;

  const fbx = usePlayerHandler();
  if (fbx) {
    fbx.castShadow = true;
    fbx.traverse((children) => {
      if (children instanceof Mesh) {
        children.castShadow = true;
      }
    });
  }
  useEffect(() => {
    exposeObject('player', ref);
  }, []);

  return (
    <group
      scale={[scale, scale, scale]}
      rotation={[0, Math.PI, 0]}
      position={config.player.initialPosition}
      ref={ref}
    >
      <primitive ref={primitiveRef} object={fbx} dispose={null} />
      <mesh castShadow position={[0, 14, 0]}>
        <sphereGeometry args={[6, 32, 32]} />
      </mesh>
    </group>
  );
};
