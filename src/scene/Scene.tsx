import { Canvas } from '@react-three/fiber';
import { RefObject, useEffect, useRef, useState } from 'react';

import config from '../config/config';
import { ObjectType, SceneContext, SceneContextType } from '../context/scene-context';
import { SceneObjects } from './SceneObjects';
import { SceneSetup } from './SceneSetup';

export const Scene = () => {
  const [objects, setObjects] = useState<SceneContextType['objects']>({});
  const objectsRef = useRef(objects);

  const updateObjects = (key: string, obj: RefObject<ObjectType> | undefined) => {
    objectsRef.current = { ...objectsRef.current, [key]: obj };
    setObjects(objectsRef.current);
  };

  const exposeObject = (key: string, obj: RefObject<ObjectType>) =>
    updateObjects(key, obj);

  const destroyObject = (key: string) => updateObjects(key, undefined);

  useEffect(() => {
    console.log('mount');
  }, []);

  return (
    <SceneContext.Provider value={{ objects, exposeObject, destroyObject }}>
      <Canvas camera={{ position: config.initialCameraPosition }}>
        <SceneObjects />
        <SceneSetup />
      </Canvas>
    </SceneContext.Provider>
  );
};
