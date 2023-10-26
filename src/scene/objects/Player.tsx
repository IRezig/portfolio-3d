/* eslint-disable */
import { Float, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { AnimationMixer, Group } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';
import { usePlayerHandler } from '../../hooks/use-player-handler';
import { Atom } from './Atom';

export const Player = () => {
  const ref = useRef<Group>(null);
  const { exposeObject } = useSceneContext();
  usePlayerHandler();

  useEffect(() => {
    exposeObject('player', ref);
  }, []);

  const { scene, animations } = useGLTF('./src/character.gtlf');
  const mixer = useRef<AnimationMixer | null>(null);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  useEffect(() => {
    /*mixer.current = new AnimationMixer(scene);
    const action = mixer.current.clipAction(animations[0]);
    action.play();*/
  }, [animations, scene]);

  return (
    <group ref={ref} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  );

  return (
    <Float
      position={config.initialPlayerPosition}
      ref={ref}
      speed={20}
      rotationIntensity={0.4}
      floatIntensity={0.8}
    >
      <Atom />
    </Float>
  );
};
