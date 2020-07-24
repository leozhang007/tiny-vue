// div 中放置子元素 h1，p
import {h, init} from 'snabbdom'

let patch = init([])

let vnode = h('div#container', [
  h('h1', 'hello snabbdom'),
  h('p', '这个是 p 标签')
])

let app = document.querySelector('#app')

let oldVnode = patch(app, vnode)

setTimeout(() => {
  vnode = h('div#container', [
    h('h1', 'hello world'),
    h('p', 'hello p')
  ])
  patch(oldVnode, vnode)

  // 清空页面元素 
  patch(oldVnode, h('!'))
}, 2000);