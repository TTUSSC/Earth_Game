<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-danger">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">
        <!-- <img src="/SSC_logo.png" height="32px" alt="Logo" /> -->
        <strong>TTU 社團博覽會</strong>
      </RouterLink>

      <button class="navbar-toggler" @click="toggleNav()" type="button" aria-controls="navbarCollapse"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <transition name="expand">
        <div v-show="isNavExpanded" class="navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item" v-if="!authStore.is_club">
              <button @click="navigateTo('/')" class="nav-link">首頁</button>
            </li>
            <li class="nav-item" v-if="!authStore.is_club">
              <button @click="navigateTo('/stamp')" class="nav-link">活動蓋章</button>
            </li>
            <li class="nav-item" v-if="authStore.is_club">
              <button @click="navigateTo('/panel')" class="nav-link">社團後台</button>
            </li>
            <li class="nav-item" v-if="authStore.is_club">
              <button @click="navigateTo('/scan')" class="nav-link">掃描新生</button>
            </li>
            <li class="nav-item">
              <button @click="navigateTo('/rules')" class="nav-link">遊戲規則</button>
            </li>
            <!-- <li class="nav-item">
              <button @click="navigateTo('/partner')" class="nav-link">合作夥伴</button>
            </li> -->
            <li class="nav-item" v-if="!authStore.isLoggedIn">
              <button @click="navigateTo('/register')" class="nav-link">註冊帳號</button>
            </li>
            <li class="nav-item" v-if="!authStore.isLoggedIn">
              <button @click="navigateTo('/club_login')" class="nav-link">社團登入</button>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isNavExpanded = ref(false);
const navbarCollapse = ref(null);
const navHeight = ref('0px');

function toggleNav() {
  isNavExpanded.value = !isNavExpanded.value;
  if (isNavExpanded.value) {
    nextTick(() => {
      updateNavHeight();
    });
  }
}

function navigateTo(path) {
  router.push(path);
  isNavExpanded.value = false;
}

function updateNavHeight() {
  if (navbarCollapse.value) {
    navHeight.value = `${navbarCollapse.value.scrollHeight}px`;
  }
}

// 當路由變化時關閉 navbar
watch(() => route.path, () => {
  isNavExpanded.value = false;
});

// 監聽窗口大小變化
window.addEventListener('resize', () => {
  if (isNavExpanded.value) {
    updateNavHeight();
  }
});

onMounted(() => {
  navbarCollapse.value = document.getElementById('navbarCollapse');
});
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  height: 0 !important;
}

.expand-enter-to,
.expand-leave-from {
  height: v-bind(navHeight);
}

/* 確保在大屏幕上 navbar 始終可見 */
@media (min-width: 768px) {
  .navbar-collapse {
    display: block !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }
}

/* 在小屏幕上應用過渡效果 */
@media (max-width: 767.98px) {
  .navbar-collapse {
    flex-basis: 100%;
    flex-grow: 1;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #dc3545;
    /* 使用與 navbar 相同的背景色 */
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 0;
  }

  .navbar-nav .nav-link {
    display: flex;
    text-align: left;
    width: 100%;
    padding-left: calc(var(--bs-gutter-x) * .5);
  }

  .nav-link {
    padding: var(--bs-nav-link-padding-y) var(--bs-nav-link-padding-x);
  }
}
</style>