<script setup>
import { ref, computed } from 'vue';
import { sha256 } from '@/assets/sha256';


const account = ref(" ");
const hashed_account = computed(() => {
  let plain = account.value.trim()
  if (plain == "") {
    return "";
  }
  return sha256(plain);
})
</script>
<template>
  <div class="container w-75">
    <h1 class="title">蓋章！</h1>

    <!-- 表單 -->
    <div class="row align-items-center needs-validation">
      <div class="col-12 mb-3">
        <strong>雜湊值為：</strong>
        <div class="text-break">{{ hashed_account }}</div>
      </div>
      <div class="col-12 mb-3">
        <input type="text" class="form-control" id="account" v-model="account" placeholder="輸入電話號碼" required>
        <div class="valid-feedback">
          Looks good!
        </div>
        <div class="invalid-feedback">
          Looks bad!
        </div>
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-primary">登入</button>
      </div>
    </div>
  </div>
</template>
