/* eslint-disable */

import { extend, useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Euler, Mesh, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { useSceneContext } from '../../context/scene-context';
import config from '../../config/config';

extend({ TextGeometry });

export const Text = ({
  value,
  position,
  rotation
}: {
  value: string;
  position: Vector3
  rotation: Euler
}) => {
  const font = useLoader(FontLoader, './src/assets/Roboto.json');
  const [_, setFontLoaded] = useState(false);
  const toggle = useRef(false);

  useEffect(() => {
    toggle.current = !toggle.current;
    setFontLoaded(toggle.current);
  }, [font]);

  return (
    <mesh 
      rotation={rotation} 
      castShadow
      position={position}
    >
      <textGeometry args={[value, { font, size: 4, height: 1 }]} />
      <meshStandardMaterial attach="material" color={'gold'} />
    </mesh>
  );
};
