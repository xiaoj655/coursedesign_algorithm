<script setup>
import { calLinePercent,getGoodControlPoint, calTangentPoints, randInt } from '@/utils/common';
import {onMounted, ref} from 'vue'
import { parse } from 'vue/compiler-sfc';

const ITEM_RADUIS = 25, LINE_WIDTH=2
let LENGTH = 6
const ITEM_COLOR = '#fbbf24', ITEM_HOVER_COLOR = '#d97706', ITEM_SELECTED_COLOR = '#451a03'
let data, data2

const svgRef = ref()
const userCost = ref(0)
const answer = ref(0)

function genData(){
  data = Array.from({length: LENGTH}, ()=>randInt(1,10))

  data2 = Array.from({length: LENGTH}, (_, i)=>{
    const a = i,
          b = randInt(i+1, LENGTH-1),
          cost = randInt(1,10)
    return [a,b,cost]
  })
  data2 = data2.filter(i=>i[1]<LENGTH)
  solution()
}

function solution(){
  let accessLine = data.map((v,i)=>[v,i])
  const visited = new Map(Array.from({length: LENGTH}, (_, i)=>[i,0]))
  while(accessLine.length > 0){
    accessLine = accessLine.sort((a,b)=>a[0]-b[0])
    const [cost , to] = accessLine.shift()
    if(visited.get(to)) continue
    visited.set(to, 1)
    answer.value += cost
    data2.forEach(x=>{
      if(x[0] == to){
        accessLine.push([x[2], x[1]])
      }else if(x[1] == to){
        accessLine.push([x[2], x[0]])
      }
    })
  }
}

class Item{
  constructor(x,y,i,cost){
    this.cx = x
    this.cy = y
    this.index = i
    this.cost = cost
    this.selected = false
    this.dom = document.createElementNS('http://www.w3.org/2000/svg','circle')
    this.textdom = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    this.textdom.setAttribute('x', x)
    this.textdom.setAttribute('y', y+5)
    this.textdom.textContent = cost
    this.textdom.style.userSelect = 'none'
    this.textdom.style.cursor = 'pointer'
    this.textdom.setAttribute('text-anchor', 'middle')
    this.dom.setAttribute('fill', ITEM_COLOR)
    this.dom.setAttribute('cx', x)
    this.dom.setAttribute('cy', y)
    this.dom.setAttribute('r', ITEM_RADUIS)
    this.dom.style.cursor = 'pointer'
  }
  static itemCollection = []
  static lines = []
  static lineTexts = []
  static connect(a, b, text){
    let lselected = false
    if(a > this.itemCollection.length || b > this.itemCollection.length){
      throw Error('index error')
    }
    a=this.itemCollection[a]
    b=this.itemCollection[b]
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const [p1, p2] = calTangentPoints(a.cx, a.cy, ITEM_RADUIS, b.cx, b.cy, ITEM_RADUIS)
    const controlPoint = getGoodControlPoint(Math.PI/5, ...p1, ...p2)
    const lineText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    lineText.setAttribute('x', controlPoint[0]/2 + p1[0]/4 + p2[0]/4)
    lineText.setAttribute('y', controlPoint[1]/2 + p1[1]/4 + p2[1]/4)
    lineText.setAttribute('font-size', '16px')
    lineText.textContent = text
    lineText.style.transition = 'all 0.1s ease-out'
    lineText.setAttribute('fill', 'red')
    this.lineTexts.push(lineText)

    line.setAttribute('d', `M ${p1[0]} ${p1[1]} Q ${controlPoint[0]} ${controlPoint[1]} ${p2[0]} ${p2[1]}`)
    line.setAttribute('fill', 'transparent')
    line.setAttribute('stroke', 'blue')
    line.setAttribute('stroke-width', LINE_WIDTH)
    line.setAttribute('stroke-linecap', 'round')
    line.style.transition = 'all 0.1s ease-out'
    line.style.cursor = 'pointer'
    line.onmouseenter = ()=>{
      line.setAttribute('stroke-width', LINE_WIDTH+2)
      lineText.setAttribute('font-size', '18px')
    }
    line.onmouseleave = ()=>{
      if(lselected) return
      line.setAttribute('stroke-width', LINE_WIDTH)
      lineText.setAttribute('font-size', '16px')
    }
    function helper(text){
      const cost = parseInt(text)
      return ()=>{
        if(lselected){
          userCost.value -= cost
          line.setAttribute('stroke', 'blue')
          line.setAttribute('stroke-width', LINE_WIDTH)
        }else{
          userCost.value += cost
          line.setAttribute('stroke', 'green')
          line.setAttribute('stroke-width', LINE_WIDTH+2)
        }
        lselected = !lselected
      }
    }
    line.onclick = helper.call(this, text)
    this.lines.push(line)

    svgRef.value.appendChild(line)
    svgRef.value.appendChild(lineText)
  }
  static clearAll(){
    this.itemCollection.forEach(i=>i.clear())
    this.lines.forEach(x=>svgRef.value.removeChild(x))
    this.lineTexts.forEach(x=>svgRef.value.removeChild(x))
    this.itemCollection.length = 0
    this.lines.length = 0
    this.lineTexts.length = 0
  }
  add(){
    svgRef.value.appendChild(this.dom)
    svgRef.value.appendChild(this.textdom)
    this.dom.onmouseenter = this.#handleHover.bind(this)
    this.dom.onmouseleave = this.#handleLeave.bind(this)
    this.textdom.onmouseenter = this.#handleHover.bind(this)
    this.textdom.onclick = this.#handleClick.bind(this)
    this.dom.onclick = this.#handleClick.bind(this)
    this.dom.style.transition = 'all 0.1s ease-in'
    return this
  }
  clear(){
    this.dom.removeEventListener('mouseenter', this.#handleHover)
    this.dom.removeEventListener('mouseleave', this.#handleLeave)
    this.dom.removeEventListener('click', this.#handleClick)
    this.textdom.removeEventListener('mouseenter', this.#handleHover)
    this.textdom.removeEventListener('click', this.#handleClick)
    svgRef.value.removeChild(this.dom)
    svgRef.value.removeChild(this.textdom)
  }
  #handleClick(){
    if(this.selected){
      this.selected = false
      userCost.value -= this.cost
      this.dom.setAttribute('fill', ITEM_HOVER_COLOR)
      this.textdom.setAttribute('fill', 'black')
    }else{
      this.selected = true
      userCost.value += this.cost
      this.dom.setAttribute('fill', ITEM_SELECTED_COLOR)
      this.textdom.setAttribute('fill', 'white')
    }
  }
  #handleHover(){
    if(this.selected) return
    this.dom.setAttribute('fill', ITEM_HOVER_COLOR)
  }
  #handleLeave(){
    if(this.selected) return
    this.dom.setAttribute('fill', ITEM_COLOR)
  }
}

function c(){
  answer.value = 0
  userCost.value = 0
  genData()
  Item.clearAll()
  let flg= false
  Item.itemCollection.push(...Array.from({length: LENGTH}, (v,i)=>{
    const dis = flg ? (80 + randInt(0,200)) : (200 + randInt(0, 100))
    flg = !flg
    const angle = Math.PI*2/LENGTH * i
    const x = new Item(512 + Math.cos(angle)*dis,
                      400+Math.sin(angle)*dis,
                      i,
                      data[i])
    return x.add()
  }))
  data2.forEach(i=>Item.connect.apply(Item, i))
}

onMounted(()=>{
  c()
})
</script>

<template>
  <div>
    <header>
      YOU: {{ userCost }}
      <br/>
      answer: {{ answer }}
      <br/>
      <span>
        tip: 现在需要给村庄通水, 可以选择修路或之间在村庄修建水井, 请你找到最小花费的方式
      </span>
      <br/>
      <label for="kk">村庄数</label>
      <input type="range" 
            id="kk"
            @change="(e)=>LENGTH=parseInt(e.target.value)"
            :value="LENGTH"
            min="3" max="10"/>
      <button @click="c" class="float-right">重置</button>
    </header>
    <svg version="1.1"
      baseProfile="full"
      width="1024"
      height="700"
      xmlns="http://www.w3.org/2000/svg"
      ref="svgRef"
    >
    </svg>
  </div>
</template>

<style scoped>
</style>