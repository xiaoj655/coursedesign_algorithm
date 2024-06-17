import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/game1',
      children: [
        {
          path: 'gmae3',
          name: '村庄通水',
          component: ()=>import('@/views/game3.vue'),
          meta: {
            index: 2,
            owner: '林炜源, 庄展权, 李关渊'
          }
        },
        {
          path: 'game2',
          name: '最长子序列',
          component: () => import('@/views/game2.vue'),
          meta: {
            index: 1,
            owner: '庄家俊, 吕顺, 向天成'
          }
        },
        {
          path: 'game1',
          name: '六度空间',
          component: () => import('@/views/game1.vue'),
          meta: {
            index: 0,
            owner: '江凯龙, 陈俊龙, 吕嘉盛'
          }
        }
      ]
    }
  ]
})

export default router
