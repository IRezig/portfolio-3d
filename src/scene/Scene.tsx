import { Canvas } from '@react-three/fiber';
import { RefObject, useRef, useState } from 'react';

import config from '../config/config';
import { ObjectType, SceneContext, SceneContextType } from '../context/scene-context';
import { Ball } from './objects/Ball';
import { Ground } from './objects/Ground';
import { Player } from './objects/Player';
import { Text } from './objects/Text';
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

  return (
    <SceneContext.Provider value={{ objects, exposeObject, destroyObject }}>
      <Canvas camera={{ position: config.initialCameraPosition }}>
        <Ball />
        <Player />
        <Ground />
        <Text />
        <SceneSetup />
      </Canvas>
    </SceneContext.Provider>
  );
};
