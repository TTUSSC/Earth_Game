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
        <div class="card-body icon-link icon-link-hover" style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
          邀請朋友！
          <i class="fa-solid fa-share-from-square bi ms-auto"></i>
        </div>
      </div>
      <div class="collapse mb-3 mx-auto" id="collapseExample">
        <div class="card card-body">
          <createQRcode url="https://ttussc.github.io/Earth_Game" />
        </div>
      </div>
      <div class="card-btn card mb-2" @click="router.push({ name: 'rules' });">
        <div class="card-body icon-link icon-link-hover" style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
          遊戲規則
          <i class="fa-solid fa-scale-balanced bi ms-auto"></i>
        </div>
      </div>
      <div v-show="!authStore.is_club" class="card-btn card mb-2" @click="router.push({ name: 'stamp' });">
        <div class="card-body icon-link icon-link-hover" style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
          攤位遊戲蓋章
          <i class="fa-solid fa-stamp bi ms-auto"></i>
        </div>
      </div>
      <div v-show="!authStore.isLoggedIn" class="card-btn card mb-2" @click="router.push({ name: 'register' });">
        <div class="card-body icon-link icon-link-hover" style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
          註冊帳號
          <i class="fa-solid fa-right-to-bracket bi ms-auto"></i>
        </div>
      </div>
      <div v-show="!authStore.isLoggedIn || (authStore.isLoggedIn && authStore.is_club)" class="card-btn card mb-2"
        @click="router.push({ name: 'club_login' });">
        <div class="card-body icon-link icon-link-hover" style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
          社團秘密通道
          <i class="fa-solid fa-dungeon bi ms-auto"></i>
        </div>
      </div>
      <div v-show="authStore.isLoggedIn" class="card-btn card mb-2">
        <div class="card-body icon-link icon-link-hover" style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);"
          data-bs-toggle="modal" data-bs-target="#logoutModal">
          我要登出了
          <i class="fa-solid fa-right-from-bracket bi ms-auto"></i>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">登出確認</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>確認要登出帳號嗎？</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary mx-2" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger mx-2" data-bs-dismiss="modal"
              @click="authStore.logout(); router.push('/');">
              登出
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped>
.card-btn:hover {
  font-weight: bold;
  cursor: pointer;
}
</style>