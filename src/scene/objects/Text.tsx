/* eslint-disable */

import { extend, useLoader } from '@react-three/fiber';
import { FileLoader } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

extend({ TextGeometry });

export const Text = () => {
  const font = useLoader(FontLoader, './src/Roboto-Bold.json');
  console.log(font);

  return (
    <mesh {...{ position: [0, 1, 0] }}>
      <textGeometry args={['test', { font, size: 4, height: 3 }]} />
      <meshBasicMaterial attach="material" color={'gold'} />
    </mesh>
  );
};
