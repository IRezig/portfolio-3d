import { Clock } from 'three';

export interface AnimationType {
  clock: Clock;
  duration: number;
  rollingBack?: boolean;
  onFinish?: () => void;
}

export interface AnimationStep<T> {
  thresholds: number[];
  start: T;
  end: T;
}

export abstract class AnimationStore<T> {
  protected anim?: AnimationType;
  protected dispatcher?: (progress: number) => AnimationStep<T> | undefined;

  play(duration: number, onFinish?: () => void) {
    this.anim = {
      duration,
      clock: new Clock(),
      onFinish,
    };
  }

  rewind(duration: number, onFinish?: () => void) {
    if (this.anim?.rollingBack) {
      return;
    }
    this.anim = {
      duration,
      clock: new Clock(),
      onFinish,
      rollingBack: true,
    };
  }

  runFrame(onProgress: (step: AnimationStep<T> | undefined, p: number) => void) {
    if (!this.anim) {
      return;
    }
    const { clock, duration } = this.anim;
    const progress = clock.getElapsedTime() / duration;
    if (progress <= 1) {
      const smartProgress = this.anim.rollingBack ? 1 - progress : progress;
      const step = this.dispatcher?.(smartProgress);
      onProgress(step, smartProgress);
    } else {
      this.anim.onFinish?.();
      this.anim = undefined;
    }
  }

  createRange(
    progress: number,
    startThreshold: number,
    endThreshold: number,
    startState: T,
    endState: T,
  ) {
    return progress >= startThreshold && progress < endThreshold
      ? {
          thresholds: [startThreshold, endThreshold],
          start: startState,
          end: endState,
        }
      : undefined;
  }
}
