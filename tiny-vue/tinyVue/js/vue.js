/**
 * 功能
 * 负责接收初始化的参数 (选项)
 * 负责把 data 中的属性注入到 Vue 实例，转换成 getter/setter
 * 负责调用 observer 监听 data 中所有属性的变化
 * 负责调用 compiler 解析指令/差值表达式
 *
 * @class Vue
 */
class Vue {
  constructor(options) {
    // 1. 通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2. 把 data 中的成员转换成 getter 和 setter，注入到 vue 实例中
    this._proxyData(this.$data)
    // 3. 调用 observer 对象，监听数据的变化
    new Observer(this.$data)
    // 4. 调用 compiler 对象，解析指令和差值表达式
    new Compiler(this)
  }

  _proxyData (data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get () {
          return data[key]
        },
        set (newValue) {
          if (newValue === data[key]) return

          data[key] = newValue
        }
      })
    })
  }
}