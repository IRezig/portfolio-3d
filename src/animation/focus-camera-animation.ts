import { easings } from '@react-spring/three';
import { Camera } from '@react-three/fiber';
import { Clock, Color, Fog, MeshPhongMaterial, Vector3 } from 'three';

import config from '../config/config';
import { ObjectsType } from '../context/scene-context';
import {
  getObjectAligment,
  getPointAroundObject,
  HeadSide,
} from '../services/vector-helpers';

interface AnimationType {
  clock: Clock;
  duration: number;
  stepIndex: number;
}

interface AnimationStep<T> {
  thresholds: number[];
  step: T;
}

export interface AnimationTimeframe {
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
  LookingUp,
  Idle,
}

export interface FocusAnimState {
  pos: Vector3;
  look: Vector3;
  bgColor: Color;
  groundColor: Color;
}

export class FocusAnimationStore {
  anim?: AnimationType;
  state: FocusAnimState = {
    pos: new Vector3(0, 0, 0),
    look: new Vector3(0, 0, 0),
    bgColor: new Color(config.scene.backgroundColor),
    groundColor: new Color(config.scene.groundColor),
  };
  steps: AnimationStep<FocusAnimState>[] = [];
  timeframe?: AnimationTimeframe;

  create(
    look: Vector3,
    pos: Vector3,
    bgColor: string,
    groundColor: string,
  ): FocusAnimState {
    return {
      pos,
      look,
      bgColor: new Color(bgColor),
      groundColor: new Color(groundColor),
    };
  }

  start(targetPos: Vector3, playerPos: Vector3, cameraPos: Vector3) {
    this.anim = {
      duration: 3,
      clock: new Clock(),
      stepIndex: 0,
    };
    const alignment = getObjectAligment(targetPos, playerPos, cameraPos);

    const step1 = this.calculateStepZoomOut(this.state, playerPos);
    const step2 = this.calculateStepFocusIn(step1, alignment, targetPos, playerPos);
    const step3 = this.calculateStepLookUp(step2, targetPos);

    // console.log('Alignment', alignment);
    this.steps = [
      {
        thresholds: [0, 0.33],
        step: step1,
      },
      {
        thresholds: [0.33, 0.66],
        step: step2,
      },
      {
        thresholds: [0.66, 0.99],
        step: step3,
      },
    ];
  }

  getCurrentStep(progress: number) {
    if (!this.anim) {
      return null;
    }
    const currentStep = this.steps[this.anim.stepIndex];
    if (!currentStep) {
      return null;
    }
    const [start, end] = currentStep.thresholds;
    if (progress >= start && progress <= end) {
      return currentStep;
    }
    this.timeframe = undefined;
    this.anim.stepIndex++;
    return this.steps[this.anim.stepIndex];
  }

  updateCurrentTimeframe(progress: number) {
    const foundStep = this.getCurrentStep(progress);
    if (!foundStep || this.timeframe) {
      return null;
    }

    const { look, pos, bgColor, groundColor } = foundStep.step;
    const range = <T>(start: T, end: T) => ({ start, end });
    this.timeframe = {
      easing: easings.easeInOutQuad,
      look: range(this.state.look.clone(), look),
      position: range(this.state.pos.clone(), pos),
      backgroundColor: range(this.state.bgColor, bgColor),
      groundColor: range(this.state.groundColor, groundColor),
    };
  }

  rollback() {}

  isAnimating() {
    this.anim !== undefined;
  }

  getTimeframeProgress = (progress: number) => {
    if (!this.anim) {
      return 0;
    }
    const current = this.steps[this.anim.stepIndex];
    if (!current) {
      return 0;
    }
    const [start, end] = current.thresholds;
    const clampedProgress = Math.min(Math.max(progress, start), end);
    return (clampedProgress - start) / (end - start);
  };

  /**
   * Run frame
   */
  run(camera: Camera, objects: ObjectsType) {
    if (!this.anim) {
      return;
    }
    const { clock, duration } = this.anim;
    const progress = clock.getElapsedTime() / duration;
    if (progress <= 1) {
      this.updateCurrentTimeframe(progress);
      const frame = this.timeframe;
      if (!frame) {
        return;
      }
      const computedProgress = this.getTimeframeProgress(progress);
      this._applyColor(computedProgress, frame, objects);
      this._applyLook(computedProgress, frame, camera);
      this._applyPosition(computedProgress, frame, camera);
    } else {
      this.anim = undefined;
      console.log('finished :)');
    }
  }

  /**
   * Step 1: Zoom out
   */
  calculateStepZoomOut(prevState: FocusAnimState, playerPos: Vector3) {
    const cameraToPlayerVector = new Vector3()
      .subVectors(prevState.pos.clone(), playerPos)
      .normalize();
    const offsetBackwardPosition = new Vector3()
      .addVectors(prevState.pos.clone(), cameraToPlayerVector.multiplyScalar(5))
      .add(new Vector3(1, 1, 0));

    return this.create(
      playerPos,
      offsetBackwardPosition,
      config.scene.backgroundColor,
      config.scene.groundColor,
    );
  }

  /**
   * Step 2: Focus in
   */
  calculateStepFocusIn(
    prevState: FocusAnimState,
    side: HeadSide,
    objectPos: Vector3,
    playerPos: Vector3,
  ) {
    const shift = (Math.PI * 1) / 8;
    const delta = new Vector3().subVectors(playerPos, objectPos);
    const angleToPlayer = Math.atan2(delta.z, delta.x);
    const finalPosition = getPointAroundObject(
      objectPos,
      playerPos,
      8,
      angleToPlayer + (side === HeadSide.Left ? -shift : shift),
    );
    return this.create(
      objectPos,
      finalPosition,
      config.scene.groundColor,
      config.scene.darkGroundColor,
    );
  }

  /**
   * Step 3: Look up
   */
  calculateStepLookUp(prevState: FocusAnimState, objectPos: Vector3) {
    const pos = prevState.pos.clone().add(new Vector3(0, 0, -5));
    return this.create(
      objectPos,
      pos,
      config.scene.darkGroundColor,
      config.scene.darkGroundColor,
    );
  }

  _applyLook = (progress: number, timeframe: AnimationTimeframe, camera: Camera) => {
    this.state.look = timeframe.look.start
      .clone()
      .lerp(timeframe.look.end, timeframe.easing(progress));
    camera.lookAt(this.state.look);
  };

  _applyPosition = (progress: number, timeframe: AnimationTimeframe, camera: Camera) => {
    this.state.pos = timeframe.position.start
      .clone()
      .lerp(timeframe.position.end, timeframe.easing(progress));
    camera.position.copy(this.state.pos);
  };

  _applyColor = (
    progress: number,
    timeframe: AnimationTimeframe,
    objects: ObjectsType,
  ) => {
    const { background, ground, fog } = objects;
    if (!background || !ground || !fog) {
      return;
    }
    const f = fog.current as unknown as Fog;
    const gr = ground.current as unknown as MeshPhongMaterial;
    const bg = background.current as unknown as Color;
    this.state.bgColor = timeframe.backgroundColor.start
      .clone()
      .lerp(timeframe.backgroundColor.end, timeframe.easing(progress));
    bg.set?.(this.state.bgColor);
    f.color.set(this.state.bgColor);
    this.state.groundColor = timeframe.groundColor.start
      .clone()
      .lerp(timeframe.groundColor.end, progress);
    gr.color.set(this.state.groundColor);
  };
}
