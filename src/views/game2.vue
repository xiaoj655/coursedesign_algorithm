<script setup>
import { randInt } from '@/utils/common';
import { ref } from 'vue'

const s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const inp = ref()
const box =ref()
const str1 = ref()
const str2 = ref()
let answer
function genData() {
  str1.value = Array.from({ length: randInt(1, 50) }, () => {
    return s[randInt(0, s.length)]
  }).join('')
  str2.value = Array.from({ length: randInt(1, 50) }, () => {
    return s[randInt(0, s.length)]
  }).join('')
  answer = solution(str1.value, str2.value)
}
function solution(str1, str2) {
  const f = Array.from({ length: str1.length + 1 },
    () => Array.from({ length: str2.length + 1 }, () => 0)
  )
  for (let i = 1; i <= str1.length; i++) {
    const a = str1[i - 1]
    for (let q = 1; q <= str2.length; q++) {
      const b = str2[q - 1]
      if (a === b) {
        f[i][q] = f[i - 1][q - 1] + 1
      } else {
        f[i][q] = Math.max(f[i - 1][q], f[i][q - 1])
      }
    }
  }
  return f[str1.length][str2.length]
}
genData()

function submit() {
  try{
    if(answer == parseInt(inp.value.value)){
      box.value.classList.remove('c')
      box.value.classList.add('b')
    }else{
      box.value.classList.remove('b')
      box.value.classList.add('c')
    }
  }catch{
    box.value.classList.add('c')
  }
}

</script>

<template>
  <main class="w-full flex flex-col
                    justify-center items-center pt-6 h-full">
    <span class="self-start">tip: 找到最长相同子序列</span>
    <button class="px-4 py-2 bg-green-400 text-slate-900 rounded"
      @click="genData">重置</button>
    <div class="text-2xl shadow px-2">{{ str1 }}</div>
    <div class="text-2xl shadow px-2 mt-2">{{ str2 }}</div>
    <div class="mt-48" ref="box">
      <label for="answer" class="mr-2">答案</label>
      <input id="answer" name="answer" type="text"
        class="shadow border px-4 py-2" ref="inp"/>
      <button @click="submit" class="border focus:ring px-4 py-2 ml-1
                        hover:bg-slate-400 transition">
        检查
      </button>
    </div>
  </main>
</template>

<style scoped>
input {
  outline: none;
}

.b{
  position: relative
}
.b::after {
  content: '正确!';
  position: absolute;
  top: 110%;
  border-radius: 5px;
  left: 0;
  width: 100%;
  padding: 10px 20px;
  text-align: center;
  background: rgba(74,222,128, 0.7);
}
.c{
  position: relative
}
.c::after {
  content: '错误!';
  color: #fff;
  position: absolute;
  top: 110%;
  border-radius: 5px;
  left: 0;
  width: 100%;
  padding: 10px 20px;
  text-align: center;
  background: rgba(255,0,0, 0.7);
}
</style>