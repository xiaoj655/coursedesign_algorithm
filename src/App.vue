<script setup>
import { uniqueIdGenerator } from './utils/common';
import { useRoute } from 'vue-router';
import {watch, ref, computed} from 'vue'

const idGen = uniqueIdGenerator()
const _ = ['六度空间', '最长子序列', '村庄通水']
const navRef = ref()
const navs = computed(()=>navRef.value.children)
const navConfig = Array.from({length:3},
    (v,i)=>{
      return {
        key: idGen.next().value,
        val: _[i] || '游戏'.concat(i+1)
      }
  })
const route = useRoute()
watch(()=>route.path,()=>{
  Array.from(navs.value).forEach(i=>i.classList.remove('nav-active'))
  navs.value[route.meta.index].classList.add('nav-active')
})
</script>

<template>
  <main class="pt-6">
    <header class="text-center">
      <h1 class="text-lg">
        算法课设
        <a href="https://github.com/xiaoj655/coursedesign_algorithm" target="_blank">
          <img src="/github.svg" class="inline w-5 h-5 hover:cursor-pointer"/>
        </a>
      </h1>
      <sub class="inline">
      <span class="text-xs font-semibold text-black">
        {{ $route.meta.owner }}
      </span>
      <span>
        匠心制作
      </span>
    </sub>
    </header>
  <nav ref="navRef" class="flex items-center justify-around border-b rounded-md">
    <button v-for="x in navConfig"
      @click="$router.push({name: x.val})"
      :key="x.key"
      class="px-5 py-2 transition-all hover:bg-sky-500 text-slate-600">
      {{ x.val }}
    </button>
  </nav>
  <router-view></router-view>
  </main>
</template>

<style scoped>
.nav-active{
  color: black;
  position: relative;
}
.nav-active::after{
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  border: 1px solid black;
  width: 100%;
}
</style>
