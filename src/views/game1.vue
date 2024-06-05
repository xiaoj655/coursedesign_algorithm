<script setup>
import { randInt, calPointDistince } from '@/utils/common';
import {ref, onMounted, onUnmounted, nextTick} from 'vue'

const RADIUS = 300
let SUM = 15
let DENSITY = 2

const wrapper = ref()
const lineCollection = []
let children
let answer = ref()
const userSelect = []
const userAccessPoint = new Map()

class Line{
  constructor(a,b){
    this.a = a
    this.b = b
  }
  draw(){
    /**
     * @type {HTMLElement} ad
     * @type {HTMLElement} bd
     */
    const ad = children[this.a-1]
    const bd = children[this.b-1]
    const _a = ad.getBoundingClientRect()
    const _b = bd.getBoundingClientRect()
    this.#drawLine([_a.width/2 + _a.left, _a.height/2 + _a.top],
                    [_b.width/2 + _b.left, _b.height/2 + _b.top],)
  }
  clear(){
    if(!this.dom){
      return
    }
    document.body.removeChild(this.dom)
    this.dom = null
  }
  /**
   * 
   * @param {[number, number]} x 
   * @param {[number, number]} y 
   */
  #drawLine(x,y){
    const width = calPointDistince(x,y)
    this.dom = document.createElement('span')
    this.dom.style.width = width + 'px'
    this.dom.classList.add('line')
    this.dom.style.transformOrigin = '0 0'
    let degree = Math.acos((y[0]-x[0])/width)
    if(y[1]<x[1]){
      degree = -degree
    }
    this.dom.style.transform = `rotate(${degree}rad)`
    this.dom.style.left = x[0] + 'px'
    this.dom.style.top = x[1] + 'px'
    document.body.appendChild(this.dom)
  }
}

function genData(sum, density){
  return Array.from({length: sum}, (i,v)=>{
          const who = v + 1
          const follow = Array.from(new Set(Array.from({length:density}, ()=>randInt(1,SUM,[who]))))
          return {
            who,
            follow
          }
        })
}

function solution(data){
  const dist = Array.from({length: SUM},(_,i)=>{
    const cur = data[i]
    return [...cur.follow]
  })
  const visited = new Map()
  let queue = []
  const ret = Array.from({length: SUM}, ()=>99999)
  ret[0]=0
  queue.push(0)
  while(queue.length){
    const cur = queue.shift()
    // if(cur == SUM-1){
    //   console.log('87')
    //   return ret[cur]
    // }
    if(visited.has(cur)){
      continue
    }
    visited.set(cur,1)
    dist[cur].forEach(i=>{
      if(!visited.has(i)){
        queue.push(i-1)
        ret[i-1] = Math.min(ret[cur]+1, ret[i-1])
      }
    })
  }
  return ret[SUM-1]
}

const data = ref(genData(SUM,DENSITY))

function verifyClick(to){
  for(let v of userAccessPoint.values()){
    if(v.includes(to)){
      return true
    }
  }
  return false
}

function handleClick(who){
  if(who === 1) return
  if(!verifyClick(who)){
    return
  }
  const ele = children[who-1]
  if(userSelect.includes(who)){
    ele.style.boxShadow = ''
    userSelect.splice(userSelect.findIndex((i)=>i==who-1), 1)
    userAccessPoint.delete(who)
  }else{
    ele.style.boxShadow = '0 0 0 4px rgba(0, 255, 0, 0.5)'
    userSelect.push(who)
    userAccessPoint.set(who, data.value[who-1].follow)
  }
}

function changeSum(x){
  SUM = parseInt(x.target.value)
}

function changeDen(x){
  DENSITY = parseInt(x.target.value)
}


async function ini(){
  data.value = genData(SUM,DENSITY)
  answer.value = solution(data.value)
  userSelect.length = 0
  // reset ele style
  Array.from(children).forEach(i=>i.style.boxShadow = '')
  while(!answer.value || answer.value > 100){
    data.value = genData(SUM,DENSITY)
    answer.value = solution(data.value)
  }
  await nextTick()
  console.log(data.value)
  /**
   * @type {HTMLElement[]}
   */
  lineCollection.forEach(x=>x.clear())
  lineCollection.length = 0
  data.value.forEach(x=>{
    x.follow.forEach(xx=>{
      lineCollection.push(new Line(x.who, xx))
    })
  })
  lineCollection.forEach(x=>x.draw())
  children[0].style.boxShadow = '0 0 0 4px rgba(0, 255, 0, 0.5)'
  userAccessPoint.set(1, data.value[0].follow)
}

onMounted(()=>{
  children = wrapper.value.children
  ini()
})
onUnmounted(()=>{
  lineCollection.forEach(x=>x.clear())
})
</script>

<template>
  <header class="flex max-w-[1024px] pt-2">
    <label for="sum">总数</label>
    <input type="range" name="sum"
            @change="changeSum"
            id="sum" min="5" max="36" :value="SUM"/>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <label for="density">稠密</label>
    <input type="range" name="sum"
            @change="changeDen"
            id="density" min="1" max="8" :value="DENSITY"/>
    <h2 class="font-semibold flex-1 text-lg text-center">{{ `1->${SUM}最短步数: ${answer}` }}</h2>
    <button @click="ini" class="border-slate-400 border px-2 py focus:ring rounded-sm">重置</button>
  </header>
  <span>
    tip: 只能点击可访问的小球, 是否可访问取决于箭头方向
  </span>
  <div
    class="wraaper relative"
    style="height: 700px; max-width: 1024px;"
    ref="wrapper"
    >
    <div v-for="item in data"
      @click="handleClick(item.who)"
      class="absolute w-10 h-10 rounded-full select-none
                text-slate-800 font-semibold hover:cursor-pointer
              bg-sky-400 text-center leading-10"
      style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
      :style="{transform: `translate(${Math.cos(Math.PI*2/SUM * item.who) * RADIUS}px,
                            ${Math.sin(Math.PI*2/SUM * item.who) * RADIUS}px`}"
    >
      {{ item.who }}
    </div>
  </div>
</template>

<style>
.line {
  background-color: black;
  height: 2px;
  position: absolute;
  z-index: -10;
}

.line::after{
  content: "";
  display: inline-block !important;
  position: absolute;
    left: 100%;
    top: 50%;
    width: 0;
    height: 0;
    transform: translate(-29px, -50%);
    border-left: 10px solid black;
    border-top:10px solid transparent;
    border-bottom: 10px solid transparent;
}
</style>