<script setup>
import { useAuthStore } from '@/stores/useAuthStore';
const authStore = useAuthStore();
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-danger">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">
        <img src="/SSC_logo.png" height="32px" />
        <span class="title">社團博覽會大地遊戲</span>
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">首頁</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/stamp" class="nav-link">蓋章</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/rank" class="nav-link">排行榜</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/partner" class="nav-link">合作夥伴</RouterLink>
          </li>
          <li class="nav-item" v-if="!authStore.isLoggedIn">
            <RouterLink to="/register" class="nav-link">註冊</RouterLink>
          </li>
          <li class="nav-item" v-if="!authStore.isLoggedIn || authStore.is_club">
            <RouterLink to="/scan" class="nav-link">我是社團</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
