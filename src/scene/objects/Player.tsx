/* eslint-disable */
import { AccumulativeShadows, Float, RandomizedLight, useGLTF } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { AnimationMixer, Group, TextureLoader } from 'three';

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

  const { scene, animations } = useGLTF('./src/assets/character.gtlf');
  const mixer = useRef<AnimationMixer | null>(null);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  useEffect(() => {
    /*mixer.current = new AnimationMixer(scene);
    const action = mixer.current.clipAction(animations[0]);
    action.play();*/
  }, [animations, scene]);
  const texture = useLoader(TextureLoader, './src/assets/Texture.png'); // replace with the actual file path

  const scale = 0.5;
  return (
    <group
      castShadow
      scale={[scale, scale, scale]}
      rotation={[0, Math.PI, 0]}
      position={config.player.initialPosition}
      ref={ref}
    >
      <Float speed={20} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <primitive object={scene} />
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial map={texture} />
        </mesh>
      </Float>
      <AccumulativeShadows
        temporal
        frames={100}
        scale={10}
        alphaTest={0.85}
        position={[0, 0.04, 0]}
      >
        <RandomizedLight
          amount={8}
          radius={10}
          ambient={0.5}
          position={[2.5, 5, -5]}
          bias={0.001}
        />
      </AccumulativeShadows>
    </group>
  );
};
