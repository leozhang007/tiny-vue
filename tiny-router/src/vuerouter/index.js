let _Vue = null
export default class VueRouter {
  static install (Vue) {
    // 1. 判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }

    VueRouter.install.installed = true

    // 2. 把 Vue 的构造函数记录在全局
    _Vue = Vue

    // 3. 把创建 Vue 的实例传入的 router 对象注入到 Vue 实例
    _Vue.mixin({
      beforeCreate () {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    this.routeMap = {}
    // observable
    this.data = _Vue.observable({
      current: '/'
    })

    this.init()
  }

  init () {
    this.createRouteMap()
    this.initComponent(_Vue)
    this.initEvent()
  }

  createRouteMap () {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式存储到 routeMap 中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponent (Vue) {
    const self = this
    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        return h('a', {
          attrs: {
            href: self.options.mode === 'hash' ? '#' + this.to : this.to
          },
          on: {
            click: this.clickhander
          }
        }, [this.$slots.default])
      },
      methods: {
        clickhander (e) {
          if (self.options.mode === 'hash') {
            location.hash = this.to
          } else {
            history.pushState({}, '', this.to)
          }

          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
      // template: "<a :href='to'><slot></slot></a>"
    })
    Vue.component('router-view', {
      render (h) {
        const cm = self.routeMap[self.data.current]
        return h(cm)
      }
    })
  }

  initEvent () {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })

    window.addEventListener('hashchange', () => {
      this.data.current = window.location.hash.slice(1)
    })
  }
}
