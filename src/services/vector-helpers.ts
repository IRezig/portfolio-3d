import { Vector3 } from 'three';

export const mergeVectors = (
  v1: Vector3,
  v2: Vector3,
  callback: (n: number, d: number) => number,
) => {
  const x = callback(v1.x, v2.x);
  const y = callback(v1.y, v2.y);
  const z = callback(v1.z, v2.z);
  return new Vector3(x, y, z);
};

export const diffVectors = (end: Vector3, start: Vector3) => {
  const x = end.x - start.x;
  const y = end.y - start.y;
  const z = end.z - start.z;
  return new Vector3(x, y, z);
};
