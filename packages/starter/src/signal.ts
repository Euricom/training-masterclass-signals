import { Dep } from './reactivity';

type Tuple<TValue> = [() => TValue, (newValue: TValue) => void];

export function createSignal<TValue>(initialValue: TValue): Tuple<TValue> {
  let value = initialValue;
  const dep = new Dep();

  function get() {
    dep.track();
    return value;
  }

  function set(newValue: TValue) {
    value = newValue;
    dep.trigger();
  }

  // return tuple
  return [get, set];
}
