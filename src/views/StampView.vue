<script setup>
import createQRcode from '@/components/createQRcode.vue'
import { ref, computed } from 'vue'
import { sha256 } from '@/assets/sha256'
import { useUserStore } from '@/stores/useUsersStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRecordsStore } from '@/stores/useRecordsStore';
import { useClubsStore } from '@/stores/useClubsStore';

const userStore = useUserStore()
const recordsStore = useRecordsStore();
const clubsStore = useClubsStore();
userStore.callAPI();
recordsStore.callAPI();
clubsStore.callAPI();

const authStore = useAuthStore();

const pageMsg = ref('');
const isError = ref(false);

const account = ref('');

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

if (authStore.isLoggedIn) {
  account.value = authStore.email;
  if (!account_locked.value) {
    account_locked.value = true;
    btn_class.value = "btn btn-danger";
    btn_text.value = "解鎖"
  }
}

const lock = async () => {
  console.log('lock btn pushed.');
  account_locked.value = !account_locked.value;
  if (account_locked.value) {
    btn_class.value = "btn btn-danger";
    btn_text.value = "解鎖"
  } else {
    authStore.token = null;
    btn_class.value = "btn btn-primary";
    btn_text.value = "鎖定"
  }

  await authStore.user_login(account.value);

  if (!authStore.isLoggedIn) {
    isError.value = true;
    pageMsg.value = "找不到與電子郵件相符的帳號。尚未註冊帳號則點擊選單註冊帳號。"

    account_locked.value = false;
    btn_class.value = "btn btn-primary";
    btn_text.value = "鎖定"
  } else {
    isError.value = false;
    pageMsg.value = ""
    await get_record();
  }
}


const records = ref([]);
const get_record = async () => {
  records.value = await recordsStore.query_by_user(authStore.email)
  console.log("email: " + authStore.email, records)
}

const clubNames = computed(() => {
  return records.value.reduce((acc, record) => {
    const clubInfo = clubsStore.get_club_by_email(record.club_email);
    acc[record.club_email] = clubInfo ? clubInfo.name : '未知社團';
    return acc;
  }, {});
});
</script>
<template>
  <div>
    <h1 class="title">蓋章！</h1>
    <!-- 顯示註冊結果訊息 -->
    <div v-if="pageMsg" class="mt-3 text-break" :class="['alert', isError ? 'alert-danger' : 'alert-success']"
      role="alert">
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
          role="tab" aria-controls="card-tab-pane" aria-selected="false" @click="get_record">
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
        <createQRcode :url="account.trim()" v-if="hashed_account != '' && authStore.isLoggedIn" />
      </div>
      <div class="tab-pane fade" id="card-tab-pane" role="tabpanel" aria-labelledby="card-tab" tabindex="0">
        <div class="mb-2">總點數：{{ records.length }}</div>
        <div class="card my-2" v-for="i in records" :key="i.created_time">
          <div class=" card-body">
            社團攤位：{{ i.club_name }}<br>
            蓋章時間：{{ i.created_time }}
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
        <div v-if="authStore.isLoggedIn">

          <div class="card">
            <!-- <div class="card-header">
              Featured
            </div> -->
            <div class="card-body">
              <p class="card-text">
                <span>姓名: {{ authStore.name }}</span><br>
                <span>暱稱: {{ authStore.nick_name }}</span><br>
                <span>電子信箱: {{ authStore.email }}</span><br>
                <span>電話號碼: {{ authStore.phone }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
