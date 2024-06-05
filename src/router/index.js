import { createRouter, createWebHistory } from 'vue-router'
import SortGame from '@/views/sort_game.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/game1',
      children: [
        {
          path: 'sort_game',
          name: '游戏3',
          component: SortGame,
          meta: {
            index: 2,
            owner: ''
          }
        },
        {
          path: 'game2',
          name: '最长子序列',
          component: () => import('@/views/game2.vue'),
          meta: {
            index: 1,
            owner: '庄家俊'
          }
        },
        {
          path: 'game1',
          name: '六度空间',
          component: () => import('@/views/game1.vue'),
          meta: {
            index: 0,
            owner: '江凯龙'
          }
        }
      ]
    }
  ]
})

export default router
