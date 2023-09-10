import { Dep, createEffect } from '../reactivity';

type Ref<TData> = {
  value: TData;
};

/**
 * Returns a reactive wrapper to the value passed in.
 * @param value
 * @returns
 */
export function ref<TValue>(value: TValue): Ref<TValue> {
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

/**
 * Returns a reactive function wrapper thats
 * @param value
 * @returns
 */
export function computed<TValue>(getter: () => TValue) {
  const computedValue = ref<TValue>(undefined as ReturnType<typeof getter>);
  createEffect(() => {
    computedValue.value = getter();
  });
  return computedValue;
}

export * from './render';
