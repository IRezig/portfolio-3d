import { Vector3 } from 'three';

const CAMERA_HEIGHT = 20;
const CAMERA_DISTANCE = 40;

export default {
  scene: {
    groundColor: '#fff',
    horizonColor: '#fff',
  },
  camera: {
    height: CAMERA_HEIGHT,
    distance: CAMERA_DISTANCE,
    initialPosition: new Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE),
  },
  player: {
    initialPosition: new Vector3(0, 0, 0),
  },
  objects: {
    ball: {
      initialPosition: new Vector3(0, 4, -40),
      zoomFocusOffset: new Vector3(0, 4, 0),
    },
    secondBall: {
      initialPosition: new Vector3(-30, 4, -120),
    },
  },
};
