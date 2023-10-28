import { Vector3 } from 'three';

export const angleToRad = (degrees: number) => {
  return (Math.PI / 180) * degrees;
};

export const angleToDegrees = (radians: number) => {
  return radians * (180 / Math.PI);
};

const dotProduct = (objectPos: Vector3, playerPos: Vector3, cameraPos: Vector3) => {
  const vectorToObject = new Vector3().subVectors(objectPos, playerPos).normalize();
  const vectorToCamera = new Vector3().subVectors(cameraPos, playerPos).normalize();
  return vectorToObject.dot(vectorToCamera);
};

export const isObjectBehind = (
  objectPos: Vector3,
  playerPos: Vector3,
  cameraPos: Vector3,
) => {
  return dotProduct(objectPos, playerPos, cameraPos) > 0;
};

export const isObjectInFov = (
  objectPos: Vector3,
  playerPos: Vector3,
  cameraPos: Vector3,
  fov: number,
) => {
  const product = dotProduct(objectPos, playerPos, cameraPos);
  if (product > 0) {
    return false;
  }

  const rads = Math.acos(product);
  const degrees = rads * (180 / Math.PI);
  return !(degrees < 180 - fov / 2);
};

export const clampProgress = (progress: number, start: number, end: number) => {
  const p = Math.min(Math.max(progress, start), end);
  return (p - start) / (end - start);
};

export enum HeadSide {
  Left = 'Left',
  Right = 'Right',
}

export const getObjectAligment = (
  objectPos: Vector3,
  playerPos: Vector3,
  cameraPos: Vector3,
): HeadSide => {
  const vectorToObject = new Vector3().subVectors(objectPos, playerPos).normalize();
  const vectorToCamera = new Vector3().subVectors(cameraPos, playerPos).normalize();
  const crossProduct = new Vector3().crossVectors(vectorToObject, vectorToCamera);
  const direction = Math.sign(crossProduct.y);
  return direction === 1 ? HeadSide.Left : HeadSide.Right;
};

export const getPointAroundObject = (
  objectPos: Vector3,
  playerPos: Vector3,
  height: number,
  angle: number,
) => {
  const distance = playerPos.distanceTo(objectPos);
  return new Vector3(
    objectPos.x + distance * Math.cos(angle),
    height,
    objectPos.z + distance * Math.sin(angle),
  );
};
