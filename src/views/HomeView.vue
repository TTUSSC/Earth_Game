<script setup>
import createQRcode from '../components/createQRcode.vue'
</script>
<template>
  <div>
    <h1>社博大地遊戲</h1>
    <button class="btn btn-primary my-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
      aria-expanded="false" aria-controls="collapseExample">
      活動邀請連結
    </button>
    <div class="collapse mb-3 mx-auto" id="collapseExample">
      <div class="card card-body">
        <createQRcode url="https://ttussc.github.io/Earth_Game" />
      </div>
    </div>
  </div>
</template>
