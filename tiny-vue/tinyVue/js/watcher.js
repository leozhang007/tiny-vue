/**
 * 当数据变化触发依赖，dep 通知所有的 Watcher 实例更新视图
 * 自身实例化的时候往 dep 对象中添加自己
 *
 * @class Watcher
 */
class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm
    // data 中的属性名称
    this.key = key;
    this.cb = cb
    // 在 Dep 的静态属性上记录当前 watcher 对象，当访问数据的时候把 watcher 添加到 dep 的 subs 中
    Dep.target = this
    // 触发一次 getter，让 dep 为当前 key 记录 watcher
    this.oldValue = vm[key]
    // 清空 target
    Dep.target = null
  }

  update () {
    const newValue = this.vm[this.key]
    if (this.oldValue === newValue) return

    this.cb(newValue)
  }
}