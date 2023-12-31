import { Euler, Vector3 } from 'three';

const CAMERA_HEIGHT = 24;
const CAMERA_DISTANCE = 34;

export default {
  scene: {
    backgroundColor: 'rgb(174, 124, 154)',
    transitionColor: 'rgb(210, 143, 164)',
    horizonColor: 'rgb(174, 124, 154)',
    groundColor: 'rgb(224, 174, 194)',
    darkGroundColor: 'rgb(124, 124, 124)',
  },
  camera: {
    height: CAMERA_HEIGHT,
    distance: CAMERA_DISTANCE,
    initialPosition: new Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE),
    focusDuration: 0.8,
    unfocusDuration: 0.8,
  },
  player: {
    initialPosition: new Vector3(0, 0, 0),
  },
  places: {
    ju: {
      initialPosition: new Vector3(0, 4, 100),
      rotation: new Euler(0, -Math.PI, 0),
    },
    besma: {
      initialPosition: new Vector3(0, 4, -100),
    },
  },
};
