import { Canvas } from '@react-three/fiber';
import { RefObject, useState } from 'react';

import config from '../config/config';
import { ObjectType, SceneContext, SceneContextType } from '../context/scene-context';
import { SceneObjects } from './SceneObjects';
import { SceneSetup } from './SceneSetup';

export const Scene = () => {
  console.log('rerender scene');
  const [objects, setObjects] = useState<SceneContextType['objects']>({});

  const exposeObject = (key: string, obj: RefObject<ObjectType>) => {
    setObjects({ ...objects, [key]: obj });
  };

  const destroyObject = (key: string) => {
    setObjects({ ...objects, [key]: undefined });
  };

  return (
    <SceneContext.Provider value={{ objects, exposeObject, destroyObject }}>
      <Canvas camera={{ position: config.initialCameraPosition }}>
        <SceneObjects />
        <SceneSetup />
      </Canvas>
    </SceneContext.Provider>
  );
};
