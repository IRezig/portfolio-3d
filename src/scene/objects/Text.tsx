/* eslint-disable */

import { extend, useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

extend({ TextGeometry });

export const Text = () => {
  const font = useLoader(FontLoader, './src/Roboto-Bold.json');
  const [_, setFontLoaded] = useState(false);
  const toggle = useRef(false)

  useEffect(() => {
    toggle.current = !toggle.current;
    setFontLoaded(toggle.current);
  }, [font]);

  return (
    <mesh {...{ position: [-5, 5, -40] }}>
      <textGeometry args={['test', { font, size: 4, height: 3 }]} />
      <meshBasicMaterial attach="material" color={'gold'} />
    </mesh>
  );
};