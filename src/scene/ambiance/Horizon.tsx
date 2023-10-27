import { ThreeElements } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Fog } from 'three';

import config from '../../config/config';
import { useSceneContext } from '../../context/scene-context';

export const Horizon = () => {
  const fogRef = useRef<Fog>(null);
  const backgroundRef = useRef<ThreeElements['color']>(null);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exposeObject('fog', fogRef as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exposeObject('background', backgroundRef as any);
  }, []);

  return (
    <>
      <color
        ref={backgroundRef}
        attach="background"
        args={[config.scene.backgroundColor]}
      />
      {/* Fog */}
      <fog attach="fog" ref={fogRef} args={[config.scene.horizonColor, 0, 520]} />
    </>
  );
};
