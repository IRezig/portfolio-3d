import { Color, Vector3 } from 'three';

import config from '../config/config';
import { FocusAnimationState, FocusAnimStep } from '../interfaces/animations.interfaces';
import { getPointAroundObject, HeadSide } from '../services/vector-helpers';
import { AnimationStore } from './animation-store';

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
      15,
      angleToPlayer + (side === HeadSide.Left ? shift : -shift),
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
}
