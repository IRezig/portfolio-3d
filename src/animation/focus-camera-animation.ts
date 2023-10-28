import { Color, Vector3 } from 'three';

import config from '../config/config';
import { getPointAroundObject, HeadSide } from '../services/vector-helpers';
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
  LookingUp,
  Idle,
}

export interface FocusAnimStep {
  pos: Vector3;
  look: Vector3;
  bgColor: Color;
  groundColor: Color;
  duration: number;
}

export class FocusAnimationStore extends AnimationStore<
  FocusAnimStep,
  FocusAnimationState
> {
  create(
    look: Vector3,
    pos: Vector3,
    bgColor: string,
    groundColor: string,
    duration: number,
  ) {
    return {
      pos,
      look,
      bgColor: new Color(bgColor),
      groundColor: new Color(groundColor),
      duration,
    };
  }

  /**
   * Step 1: Zoom out
   */
  calculateStepZoomOut(playerPos: Vector3) {
    this.update(FocusAnimationState.Idle, this.state);

    const cameraToPlayerVector = new Vector3()
      .subVectors(this.state.pos.clone(), playerPos)
      .normalize();
    const offsetBackwardPosition = new Vector3()
      .addVectors(this.state.pos.clone(), cameraToPlayerVector.multiplyScalar(5))
      .add(new Vector3(1, 1, 0));

    return this.create(
      playerPos,
      offsetBackwardPosition,
      config.scene.backgroundColor,
      config.scene.groundColor,
      0.2,
    );
  }

  /**
   * Step 2: Focus in
   */
  calculateStepFocusIn(side: HeadSide, objectPos: Vector3, playerPos: Vector3) {
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
      1.2,
    );
  }

  /**
   * Step 3: Look up
   */
  calculateStepLookUp(objectPos: Vector3) {
    const pos = this.state.pos.clone().add(new Vector3(0, 4, -10));
    return this.create(
      objectPos,
      pos,
      config.scene.groundColor,
      config.scene.darkGroundColor,
      1.3,
    );
  }
}
