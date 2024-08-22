import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RankView from '../views/RankView.vue'
import StampView from '../views/StampView.vue'
import Partner from '../views/PartnerView.vue'
import NotFound from '../views/NotFound.vue'
import RegisterView from '@/views/RegisterView.vue'
import ScanView from '@/views/ScanView.vue'
import ClubLoginView from '@/views/ClubLoginView.vue'
import ClubView from '@/views/ClubView.vue'

const router = createRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: '',
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
    {
      path: '/partner',
      name: 'partner',
      component: Partner
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/club_login',
      name: 'club_login',
      component: ClubLoginView
    },
    {
      path: '/scan',
      name: 'scan',
      component: ScanView
    },
    {
      path: '/panel',
      name: 'panel',
      component: ClubView
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
