<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
const isNavExpanded = ref(false);

function toggleNav() {
  isNavExpanded.value = !isNavExpanded.value;
  if (!isNavExpanded.value) {
    document.getElementById('navbarCollapse').classList.add('show');
    console.log("show");
  } else {
    document.getElementById('navbarCollapse').classList.remove('show');
  }
}

function navigateTo(path) {
  router.push(path);
  toggleNav(); // 縮回 navbar
}
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-danger">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">
        <img src="/SSC_logo.png" height="32px" />
        <span>社團博覽會大地遊戲</span>
      </RouterLink>

      <button class="navbar-toggler" @click="toggleNav()" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <button @click="navigateTo('/')" class="nav-link">首頁</button>
          </li>
          <li class="nav-item" v-if="!authStore.is_club">
            <button @click="navigateTo('/stamp')" class="nav-link">蓋章</button>
          </li>
          <li class="nav-item">
            <button @click="navigateTo('/partner')" class="nav-link">合作夥伴</button>
          </li>
          <li class="nav-item" v-if="!authStore.isLoggedIn">
            <button @click="navigateTo('/register')" class="nav-link">註冊</button>
          </li>
          <li class="nav-item" v-if="!authStore.isLoggedIn">
            <button @click="navigateTo('/club')" class="nav-link">我是社團</button>
          </li>
          <li class="nav-item" v-if="authStore.is_club">
            <button @click="navigateTo('/scan')" class="nav-link">掃描新生</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
