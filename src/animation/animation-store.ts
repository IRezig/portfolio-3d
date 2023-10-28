import { Clock } from 'three';

export interface AnimationType {
  clock: Clock;
  duration: number;
  onFinish?: () => void;
  rollingBack?: boolean;
  savedProgress?: number;
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
    const savedProgress = this.anim
      ? this.anim.clock.getElapsedTime() / this.anim.duration
      : undefined;
    this.anim = {
      duration: this.anim?.clock.getElapsedTime() ?? duration,
      clock: new Clock(),
      onFinish,
      savedProgress,
      rollingBack: true,
    };
  }

  runFrame(onProgress: (step: AnimationStep<T> | undefined, p: number) => void) {
    if (!this.anim) {
      return;
    }

    const { clock, duration } = this.anim;
    const progress = clock.getElapsedTime() / duration;
    if (progress > 1) {
      this.anim.onFinish?.();
      this.anim = undefined;
    } else if (!this.anim.rollingBack) {
      const step = this.dispatcher?.(progress);
      onProgress(step, progress);
    } else {
      const saved = this.anim.savedProgress ?? 1;
      const restProgress = saved ? saved * (1 - progress) : progress;
      const step = this.dispatcher?.(restProgress);
      onProgress(step, restProgress);
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
