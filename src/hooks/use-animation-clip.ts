import { Camera, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import {
  AnimationClip,
  AnimationMixer,
  Group,
  LoopOnce,
  Mesh,
  VectorKeyframeTrack,
} from 'three';

export const useAnimationClip = (
  name: string,
  obj: Mesh | Group | Camera,
  onFinish?: () => void,
) => {
  const mixer = useRef(new AnimationMixer(obj));

  useEffect(() => {
    mixer.current.addEventListener('finished', () => {
      onFinish?.();
    });
  }, []);

  useFrame((state, delta) => {
    if (mixer.current && !!mixer.current.existingAction) {
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
    return action;
  };

  return { animate };
};
