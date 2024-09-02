import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/useAuthStore'

import HomeView from '../views/HomeView.vue'
import RankView from '../views/RankView.vue'
import StampView from '../views/StampView.vue'
import Partner from '../views/PartnerView.vue'
import NotFound from '../views/NotFound.vue'
import RegisterView from '@/views/RegisterView.vue'
import ScanView from '@/views/ScanView.vue'
import ClubLoginView from '@/views/ClubLoginView.vue'
import ClubView from '@/views/ClubView.vue'
import RulesView from '@/views/RulesView.vue'
import ClubRegisterView from '@/views/ClubRegisterView.vue'
import ClubChangePasswordView from '@/views/ClubChangePasswordView.vue'

const router = createRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: '',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: "首頁"
      }
    },
    {
      path: '/stamp',
      name: 'stamp',
      component: StampView,
      meta: {
        title: "活動蓋章"
      }
    },
    {
      path: '/rank',
      name: 'rank',
      component: RankView,
      meta: {
        title: "排行"
      }
    },
    {
      path: '/partner',
      name: 'partner',
      component: Partner,
      meta: {
        title: "合作夥伴"
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        title: "註冊"
      }
    },
    {
      path: '/club/login',
      name: 'club_login',
      component: ClubLoginView,
      meta: {
        title: "社團登入"
      }
    },
    {
      path: '/scan',
      name: 'scan',
      component: ScanView,
      meta: {
        title: "掃描蓋章"
      }
    },
    {
      path: '/club/panel',
      name: 'panel',
      component: ClubView,
      meta: {
        title: "社團後台"
      }
    },
    {
      path: '/rules',
      name: 'rules',
      component: RulesView,
      meta: {
        title: "遊戲規則"
      }
    },
    {
      path: '/club/register',
      name: 'club_register',
      component: ClubRegisterView,
      meta: {
        title: "註冊社團帳號"
      }
    },
    {
      path: '/club/edit',
      name: 'club_edit',
      component: ClubChangePasswordView,
      meta: {
        title: "註冊社團帳號"
      }
    },
    // error path
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: "404 找不到東西啦~"
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: "404 找不到東西啦~"
      }
    }
  ]
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  if (!authStore.is_club && (to.name == "scan" || to.name == "panel")) return { name: 'club_login' }

  // 社團權限
  if (authStore.isLoggedIn && authStore.is_club) {
    if (to.name == "club_login" || to.name == "home") return { name: 'panel' };
  }

  if (from == 'panel' && to == 'scan') {
    if (!authStore.access_priv) return { name: 'panel' };
  }
})

export default router
