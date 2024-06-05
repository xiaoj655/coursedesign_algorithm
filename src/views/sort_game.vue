<script setup>
import {onMounted, ref} from 'vue';

let raf

const WIDTH = 800
const HEIGHT = 300

class Rect {
  constructor(height, index){
    this.height = height
    this.index = index
  }
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx, width){
    ctx.fillRect(this.index*(width+2), 300, width, -this.height*3)
  }
  clone(){
    return new Rect(this.height, this.index)
  }
}

function randomArray(min, max, length){
  if(max<min){
    throw Error('max must bigger than min')
  }
  const x = max-min
  return Array.from({length}, ()=>parseInt(Math.random()*x+min))
}

/**
 * 
 * @param {HTMLCanvasElement} userc 
 * @param {HTMLCanvasElement} sysc 
 */
function draw(userc, sysc){
  const userc_ctx = userc.getContext('2d')
  const sysc_ctx = sysc.getContext('2d')
  const length = 1000
  const arr = randomArray(0,100,length)
  const userc_rects = Array.from(arr, (v,i)=>new Rect(v,i))
  const sysc_rects = userc_rects.map(i=>i.clone())
  function render(){
    userc_ctx.fillStyle = 'green'
    sysc_ctx.fillStyle = 'blue'
    userc_rects.forEach(x=>{
      x.draw(userc_ctx, WIDTH/length)
    })
    sysc_rects.forEach(i=>{
      i.draw(sysc_ctx, WIDTH/length)
    })
  }
  render()
  // userc.addEventListener('mouseover', ()=>raf=render())
  // userc.addEventListener('mouseout', ()=>window.cancelAnimationFrame(raf))
}

onMounted(()=>{
  const userc = document.querySelector('#userc')
  const sysc = document.querySelector('#sysc')
  draw(userc, sysc)
})
</script>

<template>
  <div>
    <canvas id="userc" height="300" width="800" style="margin: 0 auto;border: 1px solid black;"></canvas>
    <canvas id="sysc" height="300" width="800" style="margin: 0 auto;border: 1px solid black;"></canvas>
  </div>
</template>