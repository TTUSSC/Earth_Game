<script setup>
import createQRcode from '../components/createQRcode.vue'
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();
</script>
<template>
  <div>
    <h1>社博大地遊戲</h1>
    <!-- <button class="btn btn-primary my-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
      aria-expanded="false" aria-controls="collapseExample">
      活動邀請連結
    </button> -->
    <section class="my-4">
      <div class="card-btn card mb-2" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false"
        aria-controls="collapseExample">
        <div class="card-body">
          邀請朋友參加大地遊戲！
        </div>
      </div>
      <div class="collapse mb-3 mx-auto" id="collapseExample">
        <div class="card card-body">
          <createQRcode url="https://ttussc.github.io/Earth_Game" />
        </div>
      </div>
      <div v-show="!authStore.isLoggedIn" class="card-btn card mb-2" @click="router.push({ name: 'register' });">
        <div class="card-body">
          第一次加入點這裡註冊帳號！
        </div>
      </div>
      <div v-show="!authStore.is_club" class="card-btn card mb-2" @click="router.push({ name: 'stamp' });">
        <div class="card-body">
          什麼？想蓋章？點這裡登入去蓋章！
        </div>
      </div>
      <div v-show="!authStore.isLoggedIn || (authStore.isLoggedIn && authStore.is_club)" class="card-btn card mb-2"
        @click="router.push({ name: 'club' });">
        <div class="card-body">
          我是社團，要走秘密通道
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped>
.card-btn:hover {
  font-weight: bold;
  cursor: pointer;
}
</style>