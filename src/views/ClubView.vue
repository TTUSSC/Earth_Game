<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useClubsStore } from '@/stores/useClubsStore';
import { useUserStore } from '@/stores/useUsersStore';
import { useRecordsStore } from '@/stores/useRecordsStore';
import { useRouter } from 'vue-router';

const usersStore = useUserStore();
const clubsStore = useClubsStore();
const recordsStore = useRecordsStore();
const authStore = useAuthStore();
clubsStore.callAPI();
usersStore.callAPI();
recordsStore.callAPI();

const pageMsg = ref('');
const isError = ref(false);

const clubName = ref('');

if (authStore.isLoggedIn && authStore.is_club) {
    // 切換成掃描
    clubName.value = authStore.name;
} else {
    // 切換成社團登入表單
}

let email = ref("");
let password = ref("");

const isLoading = ref(false);

// 添加錯誤信息
const errors = ref({
    email: '',
    password: ''
});

var formClass = ref("row g-3 my-3 needs-validation");

const router = useRouter();
const sendForm = async () => {
    isLoading.value = true;
    try {
        const isValid = await validForm();
        await authStore.club_login(email.value, password.value);
        if (isValid && authStore.isLoggedIn && authStore.is_club) {
            console.log('Club login successfully')
            isError.value = false;
            pageMsg.value = "登入成功！";
            console.log(authStore.name, authStore.email, authStore.is_club);
            clubName.value = authStore.name;
            clearForm();
            router.push({ name: 'scan' });
        } else {
            isError.value = true;
            pageMsg.value = "帳號密碼錯誤";
            console.log("帳號密碼錯誤")
        }
    } catch (error) {
        isError.value = true;
        pageMsg.value = "登入表單錯誤：" + error;
        console.error("Error submitting form:", error);
        // 處理錯誤，比如顯示錯誤消息
    } finally {
        isLoading.value = false;
    }
}

// 驗證函數
const validateField = (field, value, rules) => {
    if (rules.required && !value) {
        errors.value[field] = '此欄位為必填';
        return false;
    }
    if (rules.minLength && value.length < rules.minLength) {
        errors.value[field] = `最少需要 ${rules.minLength} 個字符`;
        return false;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
        errors.value[field] = '格式不正確';
        return false;
    }
    errors.value[field] = '';
    formClass.value = "row g-3 my-3 needs-validation was-validated"
    return true;
};

// 表單驗證
const emailError = computed(() => validateField('email', email.value, { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }));
const passwordError = computed(() => validateField('password', password.value, { required: true, minLength: 4 }));

// 檢查整個表單是否有效
const isFormValid = computed(() => {
    return emailError.value && passwordError.value
});

async function validForm() {
    // 欄位驗證
    if (!isFormValid.value) {
        formClass.value = "row g-3 my-3 needs-validation was-validated"
        return false;
    }
    return true;
}

// 清空表單的函數
const clearForm = () => {
    email.value = "";
    password.value = "";
};
</script>
<template>
    <div>
        <h1 class="mb-4">社團登入</h1>
        <!-- 顯示註冊結果訊息 -->
        <div v-if="pageMsg" class="mt-3 text-break" :class="['alert', isError ? 'alert-danger' : 'alert-success']"
            role="alert">
            {{ pageMsg }}
        </div>
        <form :class="formClass" @submit.prevent="sendForm" novalidate>
            <div class="col-md-6">
                <input type="email" v-model="email" class="form-control" :class="{ 'is-invalid': !emailError }"
                    name="email" id="email" placeholder="電子郵件" required>
                <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <div class="col-md-6">
                <input type="password" v-model="password" class="form-control" :class="{ 'is-invalid': !passwordError }"
                    name="password" id="password" placeholder="密碼" required>
                <div class="invalid-feedback">{{ errors.password }}</div>
            </div>
            <div class="col-6 d-grid mx-auto">
                <button type="submit" class="btn btn-primary" :disabled="!isFormValid || isLoading">{{ isLoading ?
                    '提交中...' : '登入' }}</button>
            </div>
        </form>

        <!-- Loading 覆蓋層 -->
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