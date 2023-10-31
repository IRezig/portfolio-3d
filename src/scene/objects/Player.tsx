import { useBox } from '@react-three/cannon';
import { useEffect, useRef } from 'react';
import { Mesh } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';
import { usePlayerHandler } from '../../hooks/use-player-handler';

export const Player = () => {
  const { exposeObject } = useSceneContext();
  const scale = 0.05;

  const [playerRef, api] = useBox(
    () => ({
      mass: 1,
      position: config.player.initialPosition.toArray(),
      rotation: config.player.initialRotation,
      fixedRotation: true,
    }),
    useRef,
  );
  const fbx = usePlayerHandler(api);
  if (fbx) {
    fbx.castShadow = true;
    fbx.traverse((children) => {
      if (children instanceof Mesh) {
        children.castShadow = true;
      }
    });
  }
  useEffect(() => {
    exposeObject('playerCannon', playerRef);
  }, []);

  return (
    <group scale={[scale, scale, scale]} ref={playerRef}>
      <primitive object={fbx} />
      <mesh castShadow>
        <boxGeometry args={[30, 32, 32]} />
      </mesh>
    </group>
  );
};
