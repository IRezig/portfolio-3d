import { Html, useProgress } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { RefObject, Suspense, useRef, useState } from 'react';

import { Loader } from '../components/Loader';
import config from '../config/config';
import { ObjectType, SceneContext, SceneContextType } from '../context/scene-context';
import { Effects } from './ambiance/Effects';
import { Horizon } from './ambiance/horizon';
import { Lights } from './ambiance/lights';
import { Ground } from './objects/Ground';
import { Player } from './objects/Player';
import { ReactNativePlace } from './places/react-native.place';

const Progress = () => {
  const { progress } = useProgress();
  return (
    <Html fullscreen>
      <Loader progress={progress} />
    </Html>
  );
};

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
        <Suspense fallback={<Progress />}>
          {/* Ambiance */}
          <Horizon />
          <Lights />
          <Effects />

          {/* Objects */}
          <Player />
          <Ground />
          <ReactNativePlace />
          {/* 
          <AccumulativeShadows
            temporal
            frames={10}
            color="#9d4b4b"
            colorBlend={0.5}
            alphaTest={0.9}
            scale={100}
            position={[0, 0.01, 0]}
          >
            <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
          </AccumulativeShadows> */}
        </Suspense>
      </Canvas>
    </SceneContext.Provider>
  );
};
