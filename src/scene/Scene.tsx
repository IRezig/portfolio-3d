import { Canvas } from '@react-three/fiber';
import { RefObject, Suspense, useRef, useState } from 'react';

import { Loader } from '../components/Loader';
import config from '../config/config';
import { ObjectType, SceneContext, SceneContextType } from '../context/scene-context';
import { Ball } from './objects/Ball';
import { Ground } from './objects/Ground';
import { Player } from './objects/Player';
import { SecondBall } from './objects/SecondBall';
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
      <Canvas shadows camera={{ position: config.camera.initialPosition }}>
        <Suspense fallback={<Loader />}>
          <SceneSetup />
          <Ball />
          <SecondBall />
          <Player />
          <Ground />
          <Text />
        </Suspense>
      </Canvas>
    </SceneContext.Provider>
  );
};
