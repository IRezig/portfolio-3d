import { Vector3 } from 'three';

const CAMERA_HEIGHT = 20;
const CAMERA_DISTANCE = 40;

export default {
  cameraHeight: CAMERA_HEIGHT,
  cameraDistance: CAMERA_DISTANCE,
  initialPlayerPosition: new Vector3(0, 0, 0),
  initialCameraPosition: new Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE),
  initialBallPosition: new Vector3(0, 4, -40),
};
