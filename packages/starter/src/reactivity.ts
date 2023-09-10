let activeEffect: Subscriber | null;

type Subscriber = () => void;

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
export function effect(cbFn: Subscriber) {
  // set the fn as the active effect and run it
  activeEffect = cbFn;
  cbFn();
  activeEffect = null;
}
