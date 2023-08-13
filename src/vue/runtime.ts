import { Dep } from '../reactivity';

export function ref<TValue>(value: TValue) {
  const dep = new Dep();
  return {
    get value() {
      dep.track();
      return value;
    },
    set value(newValue) {
      // eslint-disable-next-line no-param-reassign
      value = newValue;
      dep.trigger();
    },
  };
}

export function computed<TValue>(getter: () => TValue) {
  return getter;
}

export * from './render';
