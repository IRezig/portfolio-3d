import { createContext, RefObject, useContext } from 'react';
import { Group, Mesh } from 'three';

export type ObjectType = Mesh | Group;
export type ObjectsType = Record<string, RefObject<ObjectType> | undefined>;

export interface SceneContextType {
  objects: ObjectsType;
  exposeObject: (key: string, obj: RefObject<ObjectType>) => void;
  destroyObject: (key: string) => void;
}

export const SceneContext = createContext<SceneContextType | null>(null);
export const useSceneContext = () => useContext(SceneContext) as SceneContextType;
