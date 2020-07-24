/**
 * 负责把 data 选项中的属性转换成响应式数据
 * data 中的某个属性也是对象，把该属性转换成响应式数据
 * 数据变化发送通知
 *
 * @class Observer
 */
class Observer {
  constructor (data) {
    this.walk(data)
  }

  walk(data) {
    // 1. 判断 data 是否是对象
    if (!data || typeof data !== 'object') return

    // 2. 遍历 data 对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive (obj, key, val) {
    let that = this
    // 负责收集依赖，并发送通知
    let dep = new Dep()

    // 如果 val 是对象，把 val 内部的属性转换成响应式数据
    this.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newValue) {
        if (newValue === val) return

        val = newValue
        that.walk(newValue)
        // 发送通知
        dep.notify()
      }
    })

  }
}