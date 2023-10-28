import { Vector3 } from 'three';

const CAMERA_HEIGHT = 20;
const CAMERA_DISTANCE = 40;

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
    ball: {
      initialPosition: new Vector3(0, 4, -40),
      zoomFocusOffset: new Vector3(0, 4, 0),
    },
  },
};
