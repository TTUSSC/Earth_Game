<script setup>
import createQRcode from '../components/createQRcode.vue'
</script>
<template>
  <div>
    <h1>社博大地遊戲</h1>
    <p class="d-inline-flex gap-1">
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        掃描 QRcode
      </button>
    </p>
    <div class="collapse mb-3 mx-auto" id="collapseExample">
      <div class="card card-body">
        <createQRcode />
      </div>
    </div>
  </div>
</template>
