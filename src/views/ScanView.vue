<script setup>
import { ref } from 'vue';
import QRcodeReader from '@/components/QRcodeReader.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useClubsStore } from '@/stores/useClubsStore';
import { useUserStore } from '@/stores/useUsersStore';
import { useRecordsStore } from '@/stores/useRecordsStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const usersStore = useUserStore();
const clubsStore = useClubsStore();
const recordsStore = useRecordsStore();
const authStore = useAuthStore();
clubsStore.callAPI();
usersStore.callAPI();
recordsStore.callAPI();

const router = useRouter();

// check login inro
onMounted(() => {
    if (!authStore.isLoggedIn || !authStore.is_club) router.push({ name: 'club_login' });
})

const isLoading = ref(false);
const waiting = ref(false);

const sendStamp = async () => {
    isLoading.value = true;
    const user = usersStore.get_user_by_email(scanEmail.value);
    if (!user.asccess_priv) {
        isError.value = true;
        pageMsg.value = "帳號已經兌換過抽獎券了";
        isLoading.value = false;
        return;
    }
    if (await recordExist(authStore.email, scanEmail.value, is_IG.value)) {
        isLoading.value = false;
        return;
    }
    try {
        const formData = new FormData();
        formData.append("entry.1180634340", authStore.email);
        formData.append("entry.1788223982", scanEmail.value);
        formData.append("entry.914325063", is_IG.value);

        await
            fetch('https://docs.google.com/forms/u/2/d/e/1FAIpQLScMibiJl3amUlq6x91EwApaW7XqnRTl51ZQagvWz3vNftR3tw/formResponse', {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
        console.log('Form submitted successfully')
        isError.value = false;
        pageMsg.value = "提交 " + scanName.value + " 蓋章紀錄成功！";
    } catch (error) {
        isError.value = true;
        pageMsg.value = "紀錄提交錯誤：" + error;
        console.error("Error submitting form:", error);
        // 處理錯誤，比如顯示錯誤消息
    } finally {
        isLoading.value = false;
    }

    // 檢查有沒有上傳成功
    // if (checkSubmit()) {
    // console.log("submit successed!");
    // } else {
    // console.log("submit failed!");
    // }
}

const recordExist = async (club_email, user_email, is_IG) => {
    const record = await recordsStore.query_record(club_email, user_email, is_IG);

    console.log(is_IG, record);
    if (record) {
        // conflict
        isError.value = true;
        pageMsg.value = '已經蓋過章了！';
        return true;
    } else {
        isError.value = false;
        pageMsg.value = '';
        return false;
    }
}

const scanEmail = ref('');
const scanName = ref('');

const handleScanSuccess = async (data) => {
    if (waiting.value) return;
    waiting.value = true;

    scanEmail.value = data;
    let user = await usersStore.get_user_by_email(data);
    console.log(user);

    if (user) {
        if (user['nick_name'] != "") scanName.value = user['nick_name'];
        else scanName.value = user['name'];
        isError.value = false;
        pageMsg.value = '掃描成功！' + scanName.value;
    } else {
        isError.value = true;
        pageMsg.value = '找不到 email: ' + data + ' 的帳號。';
        waiting.value = false;
        return;
    }
    // check stamp

    // update 資料庫
    await sendStamp();
    waiting.value = false;
}

const pageMsg = ref('');
const isError = ref(false);

const is_IG = ref(false);
let toggle_type_btn = () => {
    is_IG.value = !is_IG.value;
}
</script>

<template>
    <div>
        <div v-if="authStore.isLoggedIn && authStore.is_club">
            <h1 class="mb-4">{{ authStore.name }}：{{ is_IG ? '限動' : '掃描' }}</h1>
            <div v-if="pageMsg" class="mt-3 text-break " :class="['alert', isError ? 'alert-danger' : 'alert-success']"
                role="alert">
                {{ pageMsg }}
            </div>
            <QRcodeReader @scan-success="handleScanSuccess" />
            <div class="row mb-4">
                <button class="d-grid col-6 mx-auto btn" @click="toggle_type_btn"
                    :class="{ 'btn-warning': is_IG, 'btn-success': !is_IG }">
                    {{ is_IG ? 'IG 打卡掃描' : '活動蓋章掃描' }}
                </button>
            </div>
        </div>
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
</style>