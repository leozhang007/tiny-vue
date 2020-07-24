import {init, h} from 'snabbdom'
import clas from 'snabbdom/modules/class'
import props from 'snabbdom/modules/props'
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'

let patch = init([clas, props, style, eventlisteners])

let vnode

let nextKey = 11
let margin = 5
let sortBy = 'rank'
let totalHeight = 0
let originalData = [
  { rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', elmHeight: 0 },
  { rank: 2, title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', elmHeight: 0 },
  { rank: 3, title: 'The Godfather: Part II', desc: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.', elmHeight: 0 },
  { rank: 4, title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.', elmHeight: 0 },
  { rank: 5, title: 'Pulp Fiction', desc: 'The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', elmHeight: 0 },
  { rank: 6, title: 'Schindler\'s List', desc: 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', elmHeight: 0 },
  { rank: 7, title: '12 Angry Men', desc: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.', elmHeight: 0 },
  { rank: 8, title: 'The Good, the Bad and the Ugly', desc: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.', elmHeight: 0 },
  { rank: 9, title: 'The Lord of the Rings: The Return of the King', desc: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', elmHeight: 0 },
  { rank: 10, title: 'Fight Club', desc: 'An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...', elmHeight: 0 },
]

let data = [
  originalData[0],
  originalData[1],
  originalData[2],
  originalData[3],
  originalData[4],
  originalData[5],
  originalData[6],
  originalData[7],
  originalData[8],
  originalData[9],
]

function sort(prop) {
  sortBy = prop
  data.sort((a, b) => {
    if (a[prop] > b[prop]) return 1

    if (a[prop] < b[prop]) return -1

    return 0
  })
  render()
}

function add() {
  let n = originalData[Math.floor(Math.random() * 10)]
  data = [{...n ,rank: nextKey++,}].concat(data)
  render()
}

function remove(del) {
  data = data.filter(m => m !== del)
  render()
}

function movieItem(movie) {
  return h('div.row', {
    key: movie.rank,
    style: {
      opacity: '0',
      transform: 'translate(-200px)',
      delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
      remove: { opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)` }
    },
    hook: {
      insert: vnode => {movie.elmHeight = vnode.elm.offsetHeight}
    }
  }, [
    h('div', {style: {}}, movie.rank),
    h('div', movie.title),
    h('div', movie.desc),
    h('div.btn.rm-btn', {on: {click: [remove, movie]}}, 'x')
  ])
}

function render() {
  data = data.reduce((a, m) => {
    let last = a[a.length - 1]
    m.offset = last ? last.offset + last.elmHeight + margin : margin
    return a.concat(m)
  }, [])
  totalHeight = data[data.length - 1].offset + data[data.length - 1].elmHeight
  vnode = patch(vnode, view(data))
}

function view (data) {
  return h('div', [
    h('h1', 'top 10 movies'),
    h('div', [
      h('a.btn.add', {on: {click: add}}, 'Add'),
      'sort by: ',
      h('span.btn-group', [
        h('a.btn.rank', { class: { active: sortBy === 'rank'}, on: {click: [sort, 'rank']}}, 'Rank'),
        h('a.btn.title', { class : { active: sortBy === 'title'}, on: { click: [sort, 'title']}}, 'Title'),
        h('a.btn.desc', { class: { active: sortBy === 'desc' }, on: { click: [sort, 'desc'] } }, 'Description')
      ])
    ]),
    h('div.list', { style: { heigt: totalHeight + 'px'} }, data.map(movieItem))
  ])
}

window.addEventListener('DOMContentLoaded', () => {
  let container = document.getElementById('container')
  vnode = patch(container, view(data))
  render()
})