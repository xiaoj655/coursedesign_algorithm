<script setup>
import {ref, onMounted} from 'vue'
const svgRef = ref()

function c(cx, cy, r=1){
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  circle.setAttribute('cx', cx)
  circle.setAttribute('cy', cy)
  circle.setAttribute('r', r)
  svgRef.value.appendChild(circle)
}

function cal(){
  let t = 0
  const helper = (x1,x2,x3)=>{
    return (t) => {
      return (1-t)*(1-t)*x1 + 2*(1-t)*t*x2 + t*t*x3
    }
  }
  const xh = helper(20, 110, 200)
  const yh = helper(20, 100, 20)
  while(t <= 1){
    c(xh(t), yh(t))
    t += 0.01
  }
}

onMounted(()=>{
cal()
c(20,20,5)
c(200,20,5)
c(110,60,5)
})
</script>

<template>
  <svg version="1.1" ref="svgRef" width="1024" height="800">

  </svg>
</template>