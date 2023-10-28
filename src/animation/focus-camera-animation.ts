import { easings } from '@react-spring/three';
import { Camera } from '@react-three/fiber';
import { Clock, Color, Fog, MeshPhongMaterial, Vector3 } from 'three';

import config from '../config/config';
import { ObjectsType } from '../context/scene-context';
import {
  clampProgress,
  getObjectAligment,
  getPointAroundObject,
  HeadSide,
} from '../services/vector-helpers';

interface AnimationType {
  clock: Clock;
  duration: number;
  stepIndex: number;
  rollingBack: boolean;
}

interface AnimationStep<T> {
  thresholds: number[];
  start: T;
  end: T;
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
  backgroundColor: Color;
  groundColor: Color;
}

export class FocusAnimationStore {
  anim?: AnimationType;
  state: FocusAnimState = {
    pos: new Vector3(0, 0, 0),
    look: new Vector3(0, 0, 0),
    backgroundColor: new Color(config.scene.backgroundColor),
    groundColor: new Color(config.scene.groundColor),
  };
  steps: AnimationStep<FocusAnimState>[] = [];
  focused = false;

  create(
    look: Vector3,
    pos: Vector3,
    backgroundColor: string,
    groundColor: string,
  ): FocusAnimState {
    return {
      pos,
      look,
      backgroundColor: new Color(backgroundColor),
      groundColor: new Color(groundColor),
    };
  }

  start(targetPos: Vector3, playerPos: Vector3, cameraPos: Vector3) {
    this.focused = true;
    this.anim = {
      duration: 3,
      clock: new Clock(),
      stepIndex: 0,
      rollingBack: false,
    };
    const alignment = getObjectAligment(targetPos, playerPos, cameraPos);

    const step0 = { ...this.state };
    const step1 = this.calculateStepZoomOut(step0, playerPos);
    const step2 = this.calculateStepFocusIn(step1, alignment, targetPos, playerPos);
    const step3 = this.calculateStepLookUp(step2, targetPos);

    console.log('Alignment', alignment);
    this.steps = [
      {
        thresholds: [0, 0.24],
        start: step0,
        end: step1,
      },
      {
        thresholds: [0.24, 0.84],
        start: step1,
        end: step2,
      },
      {
        thresholds: [0.84, 1],
        start: step2,
        end: step3,
      },
    ];
  }

  updateCurrentTimeframe(progress: number) {
    if (
      !this.anim ||
      this.anim.stepIndex >= this.steps.length ||
      this.anim.stepIndex < 0
    ) {
      return null;
    }
    const currentStep = this.steps[this.anim.stepIndex];
    const [start, end] = currentStep.thresholds;
    if (progress >= start && progress <= end) {
      return currentStep;
    }
    if (this.anim.rollingBack) {
      this.anim.stepIndex--;
    } else {
      this.anim.stepIndex++;
    }
    return this.steps[this.anim.stepIndex];
  }

  rollback() {
    this.anim = {
      duration: 3,
      clock: new Clock(),
      stepIndex: this.steps.length - 1,
      rollingBack: true,
    };
  }

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
      const directionalProgress = this.anim.rollingBack ? 1 - progress : progress;
      const current = this.updateCurrentTimeframe(directionalProgress);
      if (!current) {
        return;
      }
      const [start, end] = current.thresholds;
      const computedProgress = clampProgress(directionalProgress, start, end);
      this._applyColor(computedProgress, current, objects);
      this._applyLook(computedProgress, current, camera);
      this._applyPosition(computedProgress, current, camera);
    } else {
      if (this.anim.rollingBack) {
        this.focused = false;
      }
      this.anim = undefined;
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

  _applyLook = (
    progress: number,
    step: AnimationStep<FocusAnimState>,
    camera: Camera,
  ) => {
    this.state.look = step.start.look
      .clone()
      .lerp(step.end.look, easings.easeInOutQuad(progress));
    camera.lookAt(this.state.look);
  };

  _applyPosition = (
    progress: number,
    step: AnimationStep<FocusAnimState>,
    camera: Camera,
  ) => {
    this.state.pos = step.start.pos
      .clone()
      .lerp(step.end.pos, easings.easeInOutQuad(progress));
    camera.position.copy(this.state.pos);
  };

  _applyColor = (
    progress: number,
    step: AnimationStep<FocusAnimState>,
    objects: ObjectsType,
  ) => {
    const { background, ground, fog } = objects;
    if (!background || !ground || !fog) {
      return;
    }
    const f = fog.current as unknown as Fog;
    const gr = ground.current as unknown as MeshPhongMaterial;
    const bg = background.current as unknown as Color;
    this.state.backgroundColor = step.start.backgroundColor
      .clone()
      .lerp(step.end.backgroundColor, easings.easeInOutQuad(progress));
    bg.set?.(this.state.backgroundColor);
    f.color.set(this.state.backgroundColor);
    this.state.groundColor = step.start.groundColor
      .clone()
      .lerp(step.end.groundColor, progress);
    gr.color.set(this.state.groundColor);
  };
}
