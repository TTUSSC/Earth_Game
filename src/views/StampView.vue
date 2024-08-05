<script setup>
import axios from 'axios';
import createQRcode from '@/components/createQRcode.vue'
import { ref, computed } from 'vue'
import { sha256 } from '@/assets/sha256'

const pageMsg = ref('');
const isError = ref(false);

const account = ref('')

const hashed_account = computed(() => {
  let plain = account.value.trim()
  if (plain == '') {
    return ''
  }
  return sha256(plain)
})

let account_locked = ref(false);
let btn_class = ref("btn btn-primary");
let btn_text = ref("鎖定");

const users_index = computed(() => {
  for (let i = 0; i < users.value.length; i++) {
    if (users.value[i]['email'] === account.value) {
      return i;
    }
  }
  return -1;
});

const lock = async () => {
  account_locked.value = !account_locked.value;
  if (account_locked.value) {
    btn_class.value = "btn btn-danger";
    btn_text.value = "解鎖"
  } else {
    btn_class.value = "btn btn-primary";
    btn_text.value = "鎖定"
  }

  let url = "https://script.google.com/macros/s/AKfycbwQGQY4CAhuYzI5AoAzsbWx4-aXTAONiZXpXq7Ue3MkojbgbvuKnDWXLk8wDZJLyx7P_g/exec";
  const resopnse = await axios.get(url, { params: { table: 'users' } });
  users.value = resopnse.data;
  console.log(users.value);
  console.log(users_index.value);

  let idx = users_index.value;
  if (idx === -1) {
    isError.value = true;
    pageMsg.value = "找不到與電子郵件相符的帳號"

    account_locked.value = false;
    btn_class.value = "btn btn-primary";
    btn_text.value = "鎖定"
  } else {
    isError.value = false;
    pageMsg.value = ""
    user_name.value = users.value[idx]['name'];
    user_nick_name.value = users.value[idx]['nick_name'];
    user_email.value = users.value[idx]['email'];
    user_phone.value = users.value[idx]['phone_number'];
  }
}

const users = ref([]);
const clubs = ref([]);
const records = ref([]);

let user_name = ref('');
let user_nick_name = ref('');
let user_email = ref('');
let user_phone = ref('');

</script>
<template>
  <div>
    <h1 class="title">蓋章！</h1>
    <!-- 顯示註冊結果訊息 -->
    <div v-if="pageMsg" class="mt-3" :class="['alert', isError ? 'alert-danger' : 'alert-success']" role="alert">
      {{ pageMsg }}
    </div>
    <!-- 表單 -->
    <div class="row align-items-center needs-validation my-3">
      <!--
      <div class="col-12 mb-3">
        <strong>雜湊值為：</strong>
        <div class="text-break">{{ hashed_account }}</div>
      </div>
      -->
      <div class="col mb-3">
        <input type="text" class="form-control" id="account" v-model="account" placeholder="輸入 Email" required
          :disabled="account_locked" />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Looks bad!</div>
      </div>
      <div class="col-3 mb-3">
        <button type="submit" class="btn" :class="btn_class" @click="lock">{{ btn_text }}</button>
      </div>
    </div>

    <ul class="nav nav-tabs mb-2" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="qrcode-tab" data-bs-toggle="tab" data-bs-target="#qrcode-tab-pane"
          type="button" role="tab" aria-controls="qrcode-tab-pane" aria-selected="true">
          QR code
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="card-tab" data-bs-toggle="tab" data-bs-target="#card-tab-pane" type="button"
          role="tab" aria-controls="card-tab-pane" aria-selected="false">
          集點卡
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button"
          role="tab" aria-controls="profile-tab-pane" aria-selected="false">
          個人資料
        </button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="qrcode-tab-pane" role="tabpanel" aria-labelledby="qrcode-tab"
        tabindex="0">
        <createQRcode :url="hashed_account" v-if="hashed_account != ''" />
      </div>
      <div class="tab-pane fade" id="card-tab-pane" role="tabpanel" aria-labelledby="card-tab" tabindex="0">
        集點卡
      </div>
      <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
        <div v-if="users_index != -1">
          <div>姓名: {{ user_name }}</div>
          <div>暱稱: {{ user_nick_name }}</div>
          <div>電子信箱: {{ user_email }}</div>
          <div>電話號碼: {{ user_phone }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
