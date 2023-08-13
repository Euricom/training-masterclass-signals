/* eslint-disable no-param-reassign */
import { Dep } from '../reactivity';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

const outerMap = new WeakMap();
function getDep(obj: Record<PropertyKey, unknown>, key: PropertyKey) {
  let depMap = outerMap.get(obj);
  if (!depMap) {
    depMap = new Map();
    outerMap.set(obj, depMap);
  }
  let dep = depMap.get(key);
  if (!dep) {
    dep = new Dep();
    depMap.set(key, dep);
  }
  return dep;
}

const rawToProxyMap = new WeakMap();
export function reactive<TObj extends Record<PropertyKey, unknown>>(raw: TObj) {
  if (rawToProxyMap.has(raw)) {
    return rawToProxyMap.get(raw);
  }
  const proxy = new Proxy(raw, {
    get(target, key) {
      getDep(target, key).track();
      const value = target[key] as unknown;
      return isPlainObject(value) ? reactive(value) : value;
    },
    set(target, key: keyof TObj, value) {
      // eslint-disable-next-line no-param-reassign
      target[key] = value;
      getDep(target, key).trigger();
      return true;
    },
  }) as TObj;
  rawToProxyMap.set(raw, proxy);
  return proxy;
}

export function ref<TValue>(value: TValue) {
  const dep = new Dep();
  value = isPlainObject(value) ? reactive(value) : value;
  return {
    get value() {
      dep.track();
      return value;
    },
    set value(newValue) {
      value = isPlainObject(newValue) ? reactive(newValue) : newValue;
      dep.trigger();
    },
  };
}

export function computed<TValue>(getter: () => TValue) {
  return getter;
}

export * from './render';
