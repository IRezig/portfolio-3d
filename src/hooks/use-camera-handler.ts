import { useThree } from '@react-three/fiber';
import { Color, Fog, MeshPhongMaterial, Vector3 } from 'three';

import config from '../config/config';
import { useSceneContext } from '../context/scene-context';
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

function easeInOutQuad(t: number, intensity = 1.8) {
  const easedIn = Math.pow(t, intensity);
  const easedOut = Math.pow(1 - t, intensity);
  const eased =
    t < 0.5 ? easedIn / (easedIn + easedOut) : 1 - easedOut / (easedIn + easedOut);
  return eased;
}

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
    const cameraToPlayerVector = new Vector3()
      .subVectors(camera.position.clone(), playerPos)
      .normalize();
    const offsetBackwardPosition = new Vector3()
      .addVectors(camera.position.clone(), cameraToPlayerVector.multiplyScalar(12))
      .add(new Vector3(10, 4, 0));

    _animateTo(
      0.4,
      playerPos,
      offsetBackwardPosition,
      config.scene.groundColor,
      config.scene.darkGroundColor,
      () => {
        const vec = new Vector3().subVectors(targetLook, playerPos).normalize();
        const offset = vec.multiplyScalar(-22);
        const targetPosition = new Vector3().addVectors(playerPos, offset);
        const upwardOffset = new Vector3(14, 14, 0);
        const finalPosition = new Vector3().addVectors(targetPosition, upwardOffset);

        _animateTo(
          config.camera.focusDuration,
          targetLook,
          finalPosition,
          config.scene.groundColor,
          config.scene.darkGroundColor,
        );
      },
    );
  };

  const unfocusObject = () => {
    if (camBeforeFocus) {
      _animateTo(
        config.camera.unfocusDuration,
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
    const smoothProgress = easeInOutQuad(progress);
    cam.look = data.look.start.clone().lerp(data.look.end, smoothProgress);
    camera.lookAt(cam.look);
  };

  const _applyPosition = (data: FocusAnimData, progress: number) => {
    const smoothProgress = easeInOutQuad(progress);
    cam.pos = data.position.start.clone().lerp(data.position.end, smoothProgress);
    camera.position.copy(cam.pos);
  };

  const _applyColor = (data: FocusAnimData, progress: number) => {
    const smoothProgress = easeInOutQuad(progress);
    const { background, ground, fog } = objects;
    if (!background || !ground || !fog) {
      return;
    }
    const f = fog.current as unknown as Fog;
    const gr = ground.current as unknown as MeshPhongMaterial;
    const bg = background.current as unknown as Color;
    cam.bgColor = data.backgroundColor.start
      .clone()
      .lerp(data.backgroundColor.end, smoothProgress);
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
