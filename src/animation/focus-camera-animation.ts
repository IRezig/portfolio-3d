import { easings } from '@react-spring/three';
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, Euler, Fog, MeshPhongMaterial, Vector3 } from 'three';

import config from '../config/config';
import { useSceneContext } from '../context/scene-context';
import { useAnimation } from '../hooks/use-animation';
import { getObjectAligment, HeadSide } from '../services/vector-helpers';
import { AnimationStore } from './animation-store';

export interface FocusAnimData {
  easing: (n: number) => number;
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

export enum FocusAnimationState {
  ZoomingOut,
  FocusingIn,
  Idle,
}

export interface FocusAnimStep {
  pos: Vector3;
  look: Vector3;
  bgColor: Color;
  groundColor: Color;
}

export class FocusAnimationStore extends AnimationStore<
  FocusAnimStep,
  FocusAnimationState
> {
  create(look: Vector3, pos: Vector3, bgColor: string, groundColor: string) {
    return {
      pos,
      look,
      bgColor: new Color(bgColor),
      groundColor: new Color(groundColor),
    };
  }
}

export const useCameraAnimation = () => {
  const { camera } = useThree();
  const { startAnimation, run } = useAnimation<FocusAnimData>();
  const { objects } = useSceneContext();
  const focused = useRef(false);

  const _getPlayerPos = () => {
    const player = objects.player?.current;
    return player?.position.clone() ?? new Vector3(0, 0, 0);
  };
  const _getPlayerRotation = () => {
    const player = objects.player?.current;
    return player?.rotation.clone() ?? new Euler(0, 0, 0);
  };

  const animStore = useRef(
    new FocusAnimationStore({
      look: _getPlayerPos(),
      pos: camera.position.clone(),
      bgColor: new Color(config.scene.backgroundColor),
      groundColor: new Color(config.scene.groundColor),
    }),
  );

  const rotateVector = (vector: Vector3, rotation: Euler) => {
    const angleY = rotation.y;
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    return new Vector3(
      cosY * vector.x - sinY * vector.z,
      vector.y,
      sinY * vector.x + cosY * vector.z,
    );
  };

  /**
   * Focus animation
   */
  const focusObject = (targetLook: Vector3) => {
    focused.current = true;
    const playerPos = _getPlayerPos();
    const cameraToPlayerVector = new Vector3()
      .subVectors(camera.position.clone(), playerPos)
      .normalize();
    const offsetBackwardPosition = new Vector3()
      .addVectors(camera.position.clone(), cameraToPlayerVector.multiplyScalar(5))
      .add(new Vector3(1, 1, 0));

    const alignment = getObjectAligment(targetLook, playerPos, camera.position);

    const zoomOutStep = animStore.current.create(
      playerPos,
      offsetBackwardPosition,
      config.scene.backgroundColor,
      config.scene.groundColor,
    );
    animStore.current.update(FocusAnimationState.Idle, animStore.current.state);

    _animateToStep(0.64, zoomOutStep, easings.easeInOutQuad, () => {
      animStore.current.update(FocusAnimationState.ZoomingOut, zoomOutStep);
      const vec = new Vector3().subVectors(targetLook, playerPos).normalize();
      const offset = vec.multiplyScalar(-22);
      const targetPosition = new Vector3().addVectors(playerPos, offset);
      const smallShift = rotateVector(
        new Vector3(alignment === HeadSide.Left ? 14 : -14, 14, 0),
        _getPlayerRotation(),
      );
      const finalPosition = new Vector3().addVectors(targetPosition, smallShift);
      const focusingStep = animStore.current.create(
        targetLook,
        finalPosition,
        config.scene.groundColor,
        config.scene.darkGroundColor,
      );

      _animateToStep(
        config.camera.focusDuration,
        focusingStep,
        easings.easeInOutQuad,
        () => {
          animStore.current.update(FocusAnimationState.FocusingIn, focusingStep);
        },
      );
    });
  };

  const unfocusObject = () => {
    const oldStep = animStore.current.getStateFor(FocusAnimationState.ZoomingOut);
    _animateToStep(config.camera.unfocusDuration, oldStep, easings.easeInOutQuad, () => {
      animStore.current.update(FocusAnimationState.ZoomingOut, oldStep);

      const initialStep = animStore.current.getStateFor(FocusAnimationState.Idle);
      _animateToStep(0.4, initialStep, easings.easeInOutQuad, () => {
        focused.current = false;
      });
    });
  };

  const _animateToStep = (
    duration: number,
    step: FocusAnimStep,
    easing: (n: number) => number = (n) => n,
    callback?: () => void,
  ) => {
    const interpolator = <T>(start: T, end: T) => ({
      start,
      end,
    });
    startAnimation(
      {
        easing,
        look: interpolator(animStore.current.state.look.clone(), step.look),
        position: interpolator(animStore.current.state.pos.clone(), step.pos),
        backgroundColor: interpolator(
          new Color(animStore.current.state.bgColor),
          new Color(step.bgColor),
        ),
        groundColor: interpolator(
          new Color(animStore.current.state.groundColor),
          new Color(step.groundColor),
        ),
      },
      duration,
      callback,
    );
  };

  const runFocusAnimation = () => {
    if (focused.current) {
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
      animStore.current.state.pos = camera.position.clone();
      animStore.current.state.look = _getPlayerPos();
      camera.lookAt(animStore.current.state.look);
    }
  };

  /**
   * Animation helpers
   */

  const _applyLook = (data: FocusAnimData, progress: number) => {
    animStore.current.state.look = data.look.start
      .clone()
      .lerp(data.look.end, data.easing(progress));
    camera.lookAt(animStore.current.state.look);
  };

  const _applyPosition = (data: FocusAnimData, progress: number) => {
    animStore.current.state.pos = data.position.start
      .clone()
      .lerp(data.position.end, data.easing(progress));
    camera.position.copy(animStore.current.state.pos);
  };

  const _applyColor = (data: FocusAnimData, progress: number) => {
    const { background, ground, fog } = objects;
    if (!background || !ground || !fog) {
      return;
    }
    const f = fog.current as unknown as Fog;
    const gr = ground.current as unknown as MeshPhongMaterial;
    const bg = background.current as unknown as Color;
    const { state } = animStore.current;
    state.bgColor = data.backgroundColor.start
      .clone()
      .lerp(data.backgroundColor.end, data.easing(progress));
    bg.set?.(state.bgColor);
    f.color.set(state.bgColor);
    state.groundColor = data.groundColor.start
      .clone()
      .lerp(data.groundColor.end, progress);
    gr.color.set(state.groundColor);
  };

  return {
    focused,
    focusObject,
    unfocusObject,
    runFocusAnimation,
  };
};