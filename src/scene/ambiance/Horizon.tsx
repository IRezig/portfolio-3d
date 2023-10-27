import { useRef } from 'react';
import { Fog } from 'three';

import config from '../../config/config';

export const Horizon = () => {
  const fogRef = useRef<Fog>(null);

  return (
    <>
      <color attach="background" args={[config.scene.backgroundColor]} />
      {/* Fog */}
      <fog attach="fog" ref={fogRef} args={[config.scene.horizonColor, 0, 520]} />
    </>
  );
};
