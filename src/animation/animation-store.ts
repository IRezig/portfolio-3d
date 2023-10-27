export class AnimationStore<X, Y extends number> {
  history: Record<number, X>;
  state: X;

  constructor(state: X) {
    this.state = state;
    this.history = {};
  }

  getStateFor(step: Y) {
    return this.history[step];
  }

  update(step: Y, state: X) {
    this.state = state;
    this.history[step] = { ...state };
  }
}
