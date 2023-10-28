import { Clock } from 'three';

export interface AnimationType {
  clock: Clock;
  duration: number;
  stepIndex: number;
  rollingBack?: boolean;
}

export interface AnimationStep<T> {
  thresholds: number[];
  start: T;
  end: T;
}

export abstract class AnimationStore<T> {
  protected state!: T;
  protected anim?: AnimationType;
  protected steps: AnimationStep<T>[] = [];

  play(duration: number, backwards = false) {
    this.anim = {
      duration,
      clock: new Clock(),
      stepIndex: backwards ? this.steps.length - 1 : 0,
      rollingBack: backwards,
    };
  }
}
