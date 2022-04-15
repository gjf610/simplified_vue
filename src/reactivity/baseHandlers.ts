import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)
    // 依赖收集
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter(isReadonly = false) {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res;
  }
}

export const mutableHandles = {
  get,
  set
}
export const readonlyHandles = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key: ${key}, set fail, because target is readonly`, target)
    return true
  }
}