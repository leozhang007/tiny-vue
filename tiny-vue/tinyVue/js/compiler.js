/**
 * 负责编译模版，解析指令/差值表达式
 * 负责页面的首次渲染
 * 当数据变化后重新渲染视图
 *
 * @class Compiler
 */
class Compiler {
  constructor (vm) {
    this.vm = vm;
    this.el = vm.$el
    // 编译模版
    this.compile(this.el)
  }

  compile (el) {
    const nodes = el.childNodes
    Array.from(nodes).forEach(node => {
      // 判断是文本节点还是元素节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        this.compileElement(node)
      }

      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 判断是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }

  // 判断是否是属性节点
  isElementNode (node) {
    return node.nodeType === 1
  }

  // 判断是否是以 v- 开头的指令
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }

  // 判断是否是处理事件的指令
  isEventDirective (attrName) {
    return attrName.indexOf('v-on:') > -1
  }

  // 编译文本节点
  compileText (node) {
    const reg = /\{\{(.+?)\}\}/
    // 获取文本节点的内容
    const value = node.textContent
    if (reg.test(value)) {
      // 差值表达式中的值就是我们要的属性名称
      const key = RegExp.$1.trim()
      // 把差值表达式替换成具体的值
      node.textContent = value.replace(reg, this.vm[key])

      new Watcher(this.vm, key, value => {
        node.textContent = value
      })
    }
  }

  /**
   * 负责编译元素的指令
   * 处理 v-text 的首次渲染
   * 处理 v-model 的首次渲染
   *
   * @param {*} node
   * @memberof Compiler
   */
  compileElement (node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isEventDirective(attrName)) {
        let key = attrName.substr(attrName.indexOf(':') + 1)
        this.onUpdater(node, key, attr.value)
      } else if (this.isDirective(attrName)) {
        let key = attr.value
        attrName = attrName.substr(2)
        this.update(node, key, attrName)
      }
    })
  }

  /**
   * 负责更新 DOM
   * 创建 watcher
   * 
   * @param {*} node
   * @param {*} key
   * @param {*} dir
   * @memberof Compiler
   */
  update (node, key, dir) {
    const updaterFn = this[dir + 'Updater']
    updaterFn && updaterFn.call(this, node, key, this.vm[key])
  }

  textUpdater (node, key, value) {
    node.textContent = value
    // 每一个指令中创建一个 watcher，观察数据的变化
    new Watcher(this.vm, key, value => {
      node.textContent = value
    })
  }

  modelUpdater (node, key, value) {
    node.value = value
    new Watcher(this.vm, key, value => {
      node.value = value
    })

    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  htmlUpdater (node, key, value) {
    node.innerHTML = value
    new Watcher(this.vm, key, value => {
      node.innerHTML = value
    })
  }

  onUpdater (node, key, value) {
    node.addEventListener(key, this.vm.$options.methods[value].bind(this.vm))
  }

}