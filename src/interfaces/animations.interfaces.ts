import { Color, Vector3 } from 'three';

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
  Idle,
}

export interface FocusAnimStep {
  pos: Vector3;
  look: Vector3;
  bgColor: Color;
  groundColor: Color;
}
