import { createContext, RefObject, useContext } from 'react';
import { Group, Mesh } from 'three';

export type ObjectType = Mesh | Group;

export interface SceneContextType {
  objects: Record<string, RefObject<ObjectType> | undefined>;
  exposeObject: (key: string, obj: RefObject<ObjectType>) => void;
  destroyObject: (key: string) => void;
}

export const SceneContext = createContext<SceneContextType | null>(null);
export const useSceneContext = () => useContext(SceneContext) as SceneContextType;
