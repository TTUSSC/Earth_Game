import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import RankView from '../views/RankView.vue'
import StampView from '../views/StampView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/stamp',
      name: 'stamp',
      component: StampView
    },
    {
      path: '/rank',
      name: 'rank',
      component: RankView
    },

    // error path
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

export default router
