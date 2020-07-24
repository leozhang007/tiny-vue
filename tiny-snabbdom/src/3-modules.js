import {init, h} from 'snabbdom'
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'

let patch = init([
  style,
  eventlisteners
])

let vnode = h('div#app', {
  style: {
    backgroundColor: 'red'
  },
  on: {
    click: () => {
      console.log('点我了');
    }
  }
}, [
  h('h1', 'hello snabbdom'),
  h('p', 'p 标签')
])

let app = document.querySelector('#app')

let oldVnode = patch(app, vnode)

vnode = h('div', 'hello')
patch(oldVnode, vnode)
