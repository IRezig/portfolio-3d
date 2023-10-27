import { ThreeElements, useThree } from '@react-three/fiber';
import { Color, Fog, MeshPhongMaterial, Vector3 } from 'three';

import config from '../config/config';
import { useSceneContext } from '../context/scene-context';
import { diffVectors, mergeVectors } from '../services/vector-helpers';
import { useAnimation } from './use-animation';

interface FocusAnimData {
  look: {
    start: Vector3;
    end: Vector3;
  };
  position: {
    start: Vector3;
    end: Vector3;
  };
  backgroundColor: {
    start: Color;
    end: Color;
  };
  groundColor: {
    start: Color;
    end: Color;
  };
}

const cam = {
  pos: new Vector3(0, 0, 0),
  look: new Vector3(0, 0, 0),
  bgColor: new Color(config.scene.backgroundColor),
  groundColor: new Color(config.scene.groundColor),
  focused: false,
};
let camBeforeFocus: typeof cam | null = null;

export const useCameraHandler = () => {
  const { camera } = useThree();
  const { start, run } = useAnimation<FocusAnimData>();
  const { objects } = useSceneContext();
  const isFocused = () => cam.focused;

  /**
   * Focus animation
   */
  const focusObject = (targetLook: Vector3) => {
    cam.focused = true;
    camBeforeFocus = { ...cam };
    const playerPos = _getPlayerPos();
    const vec = new Vector3().subVectors(targetLook, playerPos).normalize();
    const offset = vec.multiplyScalar(-20);
    const targetPosition = new Vector3().addVectors(playerPos, offset);
    const upwardOffset = new Vector3(14, 14, 0);
    const finalPosition = new Vector3().addVectors(targetPosition, upwardOffset);
    _animateTo(
      1.2,
      targetLook,
      finalPosition,
      config.scene.groundColor,
      config.scene.darkGroundColor,
    );
  };

  const unfocusObject = () => {
    if (camBeforeFocus) {
      _animateTo(
        0.7,
        camBeforeFocus.look,
        camBeforeFocus.pos,
        config.scene.backgroundColor,
        config.scene.groundColor,
        () => {
          cam.focused = false;
        },
      );
      camBeforeFocus = null;
    }
  };

  const runCameraFrame = () => {
    if (cam.focused) {
      // Handle animation
      // ...when it's focused
      run((data, progress) => {
        _applyLook(data, progress);
        _applyPosition(data, progress);
        _applyColor(data, progress);
      });
    } else {
      // Sync up camera from other logic
      // ...while it's not focused
      cam.pos = camera.position.clone();
      cam.look = _getPlayerPos();
      camera.lookAt(cam.look.x, cam.look.y, cam.look.z);
    }
  };

  /**
   * Animation helpers
   */
  const _applyLook = (data: FocusAnimData, progress: number) => {
    const diff = diffVectors(data.look.end, data.look.start);
    const applyProgress = (n: number, d: number) => n + d * progress;
    cam.look = mergeVectors(data.look.start, diff, applyProgress);
    camera.lookAt(cam.look.x, cam.look.y, cam.look.z);
  };

  const _applyPosition = (data: FocusAnimData, progress: number) => {
    const diff = diffVectors(data.position.end, data.position.start);
    const applyProgress = (n: number, d: number) => n + d * progress;
    cam.pos = mergeVectors(data.position.start, diff, applyProgress);
    camera.position.set(cam.pos.x, cam.pos.y, cam.pos.z);
  };

  const _applyColor = (data: FocusAnimData, progress: number) => {
    const { background, ground, fog } = objects;
    if (!background || !ground || !fog) {
      return;
    }
    const f = fog.current as unknown as Fog;
    const gr = ground.current as unknown as MeshPhongMaterial;
    const bg = background.current as unknown as ThreeElements['color'];
    cam.bgColor = data.backgroundColor.start
      .clone()
      .lerp(data.backgroundColor.end, progress);
    bg.set?.(cam.bgColor);
    f.color.set(cam.bgColor);
    cam.groundColor = data.groundColor.start.clone().lerp(data.groundColor.end, progress);
    gr.color.set(cam.groundColor);
  };

  const _getPlayerPos = () => {
    const player = objects.player?.current;
    return player?.position.clone() ?? new Vector3(0, 0, 0);
  };

  const _animateTo = (
    duration: number,
    look: Vector3,
    pos: Vector3,
    bgColor: string,
    groundColor: string,
    callback?: () => void,
  ) => {
    start(
      {
        look: {
          start: cam.look.clone(),
          end: look,
        },
        position: {
          start: cam.pos.clone(),
          end: pos,
        },
        backgroundColor: {
          start: new Color(cam.bgColor),
          end: new Color(bgColor),
        },
        groundColor: {
          start: new Color(cam.groundColor),
          end: new Color(groundColor),
        },
      },
      duration,
      callback,
    );
  };

  return {
    focusObject,
    unfocusObject,
    runCameraFrame,
    isFocused,
  };
};
