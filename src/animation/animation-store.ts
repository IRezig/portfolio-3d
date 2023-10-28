import { Clock } from 'three';

export interface AnimationType {
  clock: Clock;
  duration: number;
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

  timeback: number | null = null;
  timebackClock: Clock | null = null;
  savedProgress: number | null = null;

  play(duration: number, onFinish?: () => void) {
    this.anim = {
      duration,
      clock: new Clock(),
      onFinish,
    };
  }

  rewind(duration: number, onFinish?: () => void) {
    if (this.timebackClock) {
      return;
    }
    if (this.anim) {
      this.savedProgress = this.anim.clock.getElapsedTime() / this.anim.duration;
      this.timeback = this.anim.clock.getElapsedTime();
      this.anim.onFinish = onFinish;
    } else {
      this.savedProgress = 1;
      this.timeback = duration;
      this.anim = {
        duration,
        clock: new Clock(),
        onFinish,
      };
    }
    this.timebackClock = new Clock();
  }

  runFrame(onProgress: (step: AnimationStep<T> | undefined, p: number) => void) {
    if (!this.anim) {
      return;
    }

    if (this.timeback && this.timebackClock && this.savedProgress) {
      const restProgress = this.timebackClock.getElapsedTime() / this.timeback;
      const step = this.dispatcher?.(this.savedProgress * (1 - restProgress));
      onProgress(step, this.savedProgress * (1 - restProgress));
      if (this.timebackClock.getElapsedTime() >= this.timeback) {
        this.anim?.onFinish?.();
        this.anim = undefined;
        this.timeback = null;
        this.timebackClock = null;
        this.savedProgress = null;
      }
    } else {
      const { clock, duration } = this.anim;
      const progress = clock.getElapsedTime() / duration;
      if (progress <= 1) {
        const step = this.dispatcher?.(progress);
        onProgress(step, progress);
      } else {
        this.anim.onFinish?.();
        this.anim = undefined;
      }
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
