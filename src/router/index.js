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
          path: 'game4',
          name: '游戏4',
          component: ()=>import('@/views/game4.vue'),
          meta: {
            index: 3,
            owner: ''
          }
        },
        {
          path: 'gmae3',
          name: '村庄通水',
          component: ()=>import('@/views/game3.vue'),
          meta: {
            index: 2,
            owner: '林炜源'
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
