/* eslint-disable */

import { extend, useLoader } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

extend({ TextGeometry });

export const Text = () => {
  const font = useLoader(FontLoader, './src/Roboto-Bold.json');
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (font) setFontLoaded(true);
  }, [font]);

  return (
    <mesh {...{ position: [-5, 5, -40] }}>
      <textGeometry args={['test', { font, size: 4, height: 3 }]} />
      <meshBasicMaterial attach="material" color={'gold'} />
    </mesh>
  );
};
