/* eslint-disable @typescript-eslint/no-explicit-any */
let activeEffect: Subscriber | null;

type Subscriber<TResult = void> = () => TResult;

export class Dep {
  subscribers = new Set<Subscriber>();

  track() {
    // 1. Add the active effect to the subscribers
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }

  trigger() {
    // 1. Run all the subscribers
    this.subscribers.forEach((sub) => sub());
  }
}

// when state changes, run the callback function
// alternative names:
//    whenStateChanged: my presentation (initially)
//    createEffect: Solid
//    effect: Angular 16+
export function createEffect(cbFn: Subscriber): void {
  // set the fn as the active effect and run it
  activeEffect = cbFn;
  cbFn();
  activeEffect = null;
}
