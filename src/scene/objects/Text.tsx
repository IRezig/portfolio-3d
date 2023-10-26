/* eslint-disable */

import { extend, useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

extend({ TextGeometry });

export const Text = () => {
  const font = useLoader(FontLoader, './src/assets/Roboto-Bold.json');
  const [_, setFontLoaded] = useState(false);
  const toggle = useRef(false);

  useEffect(() => {
    toggle.current = !toggle.current;
    setFontLoaded(toggle.current);
  }, [font]);

  return (
    <mesh castShadow receiveShadow {...{ position: [30, 5, -120] }}>
      <textGeometry args={['test', { font, size: 4, height: 3 }]} />
      <meshLambertMaterial attach="material" color={'gold'} />
    </mesh>
  );
};
