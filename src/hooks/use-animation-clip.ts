import { Camera, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import {
  AnimationClip,
  AnimationMixer,
  Group,
  LoopOnce,
  Mesh,
  VectorKeyframeTrack,
} from 'three';

export const useAnimationClip = (name: string, obj: Mesh | Group | Camera) => {
  const mixer = useRef(new AnimationMixer(obj));

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  const animate = (duration: number, tracks: VectorKeyframeTrack[]) => {
    const clip = new AnimationClip(name, duration, tracks);
    const action = mixer.current.clipAction(clip);
    action.setDuration(duration);
    action.setLoop(LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    console.log('play');
    return action;
  };

  return { animate };
};
