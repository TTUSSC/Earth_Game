<script setup>
import createQRcode from '@/components/createQRcode.vue'
import { ref, onMounted, computed } from 'vue'
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

const access_priv = computed(() => authStore.access_priv);


let account_locked = ref(false);
let btn_class = ref("btn btn-primary");
let btn_text = ref("登入");

const lock = async () => {
  console.log('lock btn pushed.');
  account_locked.value = !account_locked.value;
  if (account_locked.value) {
    btn_class.value = "btn btn-danger";
    btn_text.value = "登出"
  } else {
    btn_class.value = "btn btn-primary";
    btn_text.value = "登入"
  }

  if (account_locked.value) {
    console.log('login account:', account);
    await authStore.user_login(account.value);

    if (!authStore.isLoggedIn) {
      isError.value = true;
      pageMsg.value = "找不到與電子郵件相符的帳號。尚未註冊帳號則點擊選單註冊帳號。"

      account_locked.value = false;
      btn_class.value = "btn btn-primary";
      btn_text.value = "登入"
    } else {
      isError.value = false;
      pageMsg.value = ""
      await authStore.get_records();
    }
  } else {
    authStore.logout();
  }
}

const tabContent = ref(null);
const remainingHeight = ref(0);

onMounted(() => {
  console.log("auth email:", authStore.email)
  if (authStore.isLoggedIn) {
    console.log("user is already loged in.")
    account.value = authStore.email;
    if (!account_locked.value) {
      account_locked.value = true;
      btn_class.value = "btn btn-danger";
      btn_text.value = "登出"
    }
  }
  // 在元件掛載後計算剩餘空間
  calculateRemainingHeight();
  window.addEventListener('resize', calculateRemainingHeight);
});

if (authStore.isLoggedIn) {
  console.log("user is already loged in.")
  account.value = authStore.email;
  if (!account_locked.value) {
    account_locked.value = true;
    btn_class.value = "btn btn-danger";
    btn_text.value = "登出"
  }
}

const calculateRemainingHeight = () => {
  if (tabContent.value) {
    const tabContentRect = tabContent.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    remainingHeight.value = windowHeight - tabContentRect.top - 110;
    console.log("剩餘高度：", remainingHeight.value);
  }
};

const time_formatter = new Intl.DateTimeFormat('zh-TW', {
  // year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  // second: '2-digit',
  hour12: false
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
    <form class="row align-items-center needs-validation my-3" @submit.prevent="lock">
      <div class="col mb-3">
        <input type="email" class="form-control" id="account" v-model="account" placeholder="輸入 Email" required
          :disabled="account_locked" />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Looks bad!</div>
      </div>
      <div class="col-3 mb-3">
        <button type="submit" class="btn" :class="btn_class">{{ btn_text }}</button>
      </div>
    </form>
    <!-- 表單結束 -->

    <!-- tab 按鈕 -->
    <ul class="nav nav-tabs mb-2" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="qrcode-tab" data-bs-toggle="tab" data-bs-target="#qrcode-tab-pane"
          type="button" role="tab" aria-controls="qrcode-tab-pane" aria-selected="true">
          QR code
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="card-tab" data-bs-toggle="tab" data-bs-target="#card-tab-pane" type="button"
          role="tab" aria-controls="card-tab-pane" aria-selected="false" @click="authStore.get_records();">
          集點卡
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button"
          role="tab" aria-controls="profile-tab-pane" aria-selected="false" @click="authStore.update_auth();">
          個人資料
        </button>
      </li>
    </ul>

    <div class="tab-content" id="myTabContent" ref="tabContent">
      <div class="tab-pane fade show active" id="qrcode-tab-pane" role="tabpanel" aria-labelledby="qrcode-tab"
        tabindex="0">
        <div v-if="authStore.isLoggedIn && authStore.access_priv" class="mx-auto" :style="{
          maxHeight: remainingHeight + `px`
        }">
          <createQRcode :url="account.trim()" />
        </div>
        <div v-else-if="authStore.isLoggedIn && !authStore.access_priv">
          兌換完抽獎券，帳號已經被鎖定了喔～
        </div>
        <div v-else>
          沒登入不能掃描 QR code 喔
        </div>
      </div>
      <div class=" tab-pane fade" id="card-tab-pane" role="tabpanel" aria-labelledby="card-tab" tabindex="0">
        <div v-if="authStore.isLoggedIn">
          <div class="mb-2">總點數：{{ authStore.records_len }}</div>
          <div class="overflow-auto" :style="{
            maxHeight: remainingHeight + `px`
          }">
            <div class="card my-2" v-for="i in computed(() => authStore.records).value" :key="i.created_time">
              <div class="card-header">
                <!-- <span class="ms-auto">{{ time_formatter.format(new Date(i.created_time)) }} @ </span> -->
                <strong>{{ i.club_name }}&nbsp;</strong>
                <span v-if="i.is_ig" class="badge rounded-pill text-bg-danger">限時動態</span>
              </div>
              <div class="card-body">
                <p v-if="i.club_stamp != ''">{{ i.club_stamp }}</p>
                蓋章時間：{{ time_formatter.format(new Date(i.created_time)) }}
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          這是一張空的集點卡呢
        </div>
      </div>
      <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
        <div class="card" v-if="authStore.isLoggedIn">
          <div class="card-header">
            <strong>{{ authStore.name }}&nbsp;</strong>
            <span class="badge rounded-pill"
              :class="{ 'text-bg-success': access_priv, 'text-bg-danger': !access_priv }">
              {{ access_priv ? "集點中" : "已兌換抽獎券" }}</span>
          </div>
          <div class="card-body">
            <p class="card-text">
              <span>暱稱： {{ authStore.nick_name }}</span><br>
              <span>科系： {{ authStore.department }}</span><br>
              <span>電子信箱： {{ authStore.email }}</span><br>
              <span>電話號碼： {{ authStore.phone }}</span><br>
            </p>
          </div>
        </div>

        <div v-else>
          這裡什麼都沒有喔 (ゝ∀･)
        </div>
      </div>
    </div>
  </div>
</template>
