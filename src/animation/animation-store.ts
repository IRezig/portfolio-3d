import { Clock } from 'three';

export interface AnimationType {
  clock: Clock;
  duration: number;
  stepIndex: number;
  rollingBack?: boolean;
  onFinish?: () => void;
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

  play(duration: number, backwards = false, onFinish?: () => void) {
    this.anim = {
      duration,
      clock: new Clock(),
      stepIndex: backwards ? this.steps.length - 1 : 0,
      rollingBack: backwards,
      onFinish,
    };
  }

  runFrame(onProgress: (p: number) => void) {
    if (!this.anim) {
      return;
    }
    const { clock, duration } = this.anim;
    const progress = clock.getElapsedTime() / duration;
    if (progress <= 1) {
      const directionalProgress = this.anim.rollingBack ? 1 - progress : progress;
      onProgress(directionalProgress);
    } else {
      this.anim.onFinish?.();
      this.anim = undefined;
    }
  }
}
