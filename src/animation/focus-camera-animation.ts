import { easings } from '@react-spring/three';
import { Camera } from '@react-three/fiber';
import { Color, Fog, MeshPhongMaterial, Vector3 } from 'three';

import config from '../config/config';
import { ObjectsType, ObjectType } from '../context/scene-context';
import {
  clampProgress,
  getObjectAligment,
  getPointAroundObject,
  HeadSide,
} from '../services/vector-helpers';
import { AnimationStep, AnimationStore } from './animation-store';

export interface FocusAnimState {
  pos: Vector3;
  look: Vector3;
  backgroundColor: Color;
  groundColor: Color;
}

export class FocusAnimationStore extends AnimationStore<FocusAnimState> {
  focused?: Vector3;
  camera: Camera;
  player!: ObjectType;

  constructor(camera: Camera) {
    super();
    this.camera = camera;
  }

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

  /**
   * Calculate steps
   */
  calculateSteps() {
    const objectPos = this.focused;
    if (!objectPos) {
      return;
    }
    const alignment = getObjectAligment(
      objectPos,
      this.player.position,
      this.camera.position,
    );

    const step0 = {
      pos: this.camera.position.clone(),
      look: this.player.position.clone(),
      backgroundColor: new Color(config.scene.backgroundColor),
      groundColor: new Color(config.scene.groundColor),
    };
    const step1 = this.calculateStepZoomOut(step0);
    const step2 = this.calculateStepFocusIn(step1, alignment, objectPos);
    const step3 = this.calculateStepLookUp(step2, objectPos);

    this.dispatcher = (progress: number) =>
      this.createRange(progress, 0, 0.34, step0, step1) ||
      this.createRange(progress, 0.33, 0.8, step1, step2) ||
      this.createRange(progress, 0.79, 1, step2, step3);

    // console.log('Alignment', alignment);
  }

  start(targetPos: Vector3) {
    this.focused = targetPos;
    this.play(3);
    this.calculateSteps();
  }

  rollback() {
    if (this.anim?.rollingBack) {
      return;
    }
    this.rewind(2, () => {
      this.focused = undefined;
    });
  }

  /**
   * Run frame
   */
  run(objects: ObjectsType) {
    this.runFrame((current, progress) => {
      if (!current) {
        return;
      }
      const [start, end] = current.thresholds;
      const computedProgress = clampProgress(progress, start, end);
      this._applyColor(computedProgress, current, objects);
      this._applyLook(computedProgress, current);
      this._applyPosition(computedProgress, current);
    });
  }

  /**
   * Step 1: Zoom out
   */
  calculateStepZoomOut(prevState: FocusAnimState) {
    const cameraToPlayerVector = new Vector3()
      .subVectors(prevState.pos.clone(), this.player.position)
      .normalize();
    const offsetBackwardPosition = new Vector3()
      .addVectors(prevState.pos.clone(), cameraToPlayerVector.multiplyScalar(5))
      .add(new Vector3(1, 1, 0));

    return this.create(
      this.player.position.clone(),
      offsetBackwardPosition,
      config.scene.backgroundColor,
      config.scene.groundColor,
    );
  }

  /**
   * Step 2: Focus in
   */
  calculateStepFocusIn(prevState: FocusAnimState, side: HeadSide, objectPos: Vector3) {
    const shift = (Math.PI * 1) / 8;
    const delta = new Vector3().subVectors(this.player.position, objectPos);
    const angleToPlayer = Math.atan2(delta.z, delta.x);
    const finalPosition = getPointAroundObject(
      objectPos,
      this.player.position,
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

  /**
   * Apply Progress
   */
  _applyLook = (progress: number, step: AnimationStep<FocusAnimState>) => {
    const look = step.start.look
      .clone()
      .lerp(step.end.look, easings.easeInOutQuad(progress));
    this.camera.lookAt(look);
  };

  _applyPosition = (progress: number, step: AnimationStep<FocusAnimState>) => {
    const pos = step.start.pos
      .clone()
      .lerp(step.end.pos, easings.easeInOutQuad(progress));
    this.camera.position.copy(pos);
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
    const backgroundColor = step.start.backgroundColor
      .clone()
      .lerp(step.end.backgroundColor, easings.easeInOutQuad(progress));
    bg.set?.(backgroundColor);
    f.color.set(backgroundColor);
    const groundColor = step.start.groundColor
      .clone()
      .lerp(step.end.groundColor, progress);
    gr.color.set(groundColor);
  };
}
