<script setup>
import { uniqueIdGenerator } from './utils/common';
import { useRoute } from 'vue-router';
import {watch, ref, computed} from 'vue'

const idGen = uniqueIdGenerator()
const _ = ['六度空间']
const navRef = ref()
const navs = computed(()=>navRef.value.children)
const navConfig = Array.from({length:5},
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
        <a href=""></a>
        <img src="/github.svg" class="h-5 w-5 inline hover:cursor-pointer"/>
      </h1>
    </header>
  <nav ref="navRef" class="flex items-center justify-around rounded-md border-b">
    <button v-for="x in navConfig"
      @click="$router.push({name: x.val})"
      :key="x.key"
      class="px-5 py-2 hover:bg-sky-500 transition-all text-slate-600">
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
