/* eslint-disable */

import { extend, useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Mesh } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { useSceneContext } from '../../context/scene-context';

extend({ TextGeometry });

export const Text = () => {
  const font = useLoader(FontLoader, './src/assets/Roboto-Bold.json');
  const [_, setFontLoaded] = useState(false);
  const toggle = useRef(false);
  const ref = useRef<Mesh>(null);
  const { exposeObject } = useSceneContext();

  useEffect(() => {
    exposeObject('text', ref);
  }, []);

  useEffect(() => {
    toggle.current = !toggle.current;
    setFontLoaded(toggle.current);
  }, [font]);

  return (
    <mesh ref={ref} castShadow {...{ position: [30, 5, -120] }}>
      <textGeometry args={['test', { font, size: 4, height: 3 }]} />
      <meshLambertMaterial attach="material" color={'gold'} />
    </mesh>
  );
};
