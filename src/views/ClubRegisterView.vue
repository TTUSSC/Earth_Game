<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useClubsStore } from '@/stores/useClubsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { sha256 } from '@/assets/sha256';

const router = useRouter();
const authStore = useAuthStore();
const clubsStore = useClubsStore();

let name = ref("");
let email = ref("");
let password_raw = ref("");
let password = ref(computed(() => sha256(password_raw.value)));
let text = ref("");

const isLoading = ref(false);
const pageMsg = ref('');
const isError = ref(false);

// 添加錯誤信息
const errors = ref({
    name: '',
    email: '',
    password: '',
    text: ''
});

var was_validated = ref(false);

const sendForm = async () => {
    was_validated.value = true;
    isLoading.value = true;
    try {
        const isValid = await validData();
        if (isValid) {
            console.log('prepare form data');
            const formData = new FormData();
            formData.append("entry.1657837598", name.value);
            formData.append("entry.478569220", email.value.toLowerCase());
            formData.append("entry.433170047", password.value);
            formData.append("entry.504494998", text.value);
            console.log('開始發送社團註冊請求');
            await fetch('https://docs.google.com/forms/u/2/d/e/1FAIpQLSfTqC-Z6ByQYiYedMlCGtwsJ1jdZr8Ci5_QtkCunPgNEoVcbA/formResponse', {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
            console.log('社團註冊送出成功')
            console.log("Submitted email:", email.value);

            console.log("開始檢查註冊狀態");
            let club = null;
            // 嘗試 5 次
            for (let i = 0; i < 5; i++) {
                console.log(`Attempt ${i + 1} to fetch user data`);
                await clubsStore.callAPI();
                club = await clubsStore.get_club_by_email(email.value);
                console.log("API response:", club);
                if (club) {
                    console.log("i=", i, "found updated user:", club)
                    isError.value = false;
                    break;
                } else isError.value = true;
            }

            if (!isError.value) {
                pageMsg.value = "註冊成功！";
                console.log("trying to login.");
                await clubsStore.callAPI();
                await authStore.club_login(email.value, password.value);
                console.log('name:', authStore.name);
                console.log('email:', authStore.email);
                isLoading.value = false;
                clearForm();
                router.push({
                    name: 'panel'
                });
            } else {
                pageMsg.value = "資料提交失敗";
            }

        } else {
            isLoading.value = false;
            console.log("驗證失敗")
        }
    } catch (error) {
        isError.value = true;
        pageMsg.value = "註冊表單錯誤：" + error;
        was_validated.value = false
        console.error("Error submitting form:", error);
        // 處理錯誤，比如顯示錯誤消息
    } finally {
        isLoading.value = false;
    }
}

// 驗證函數
const validateField = (field, value, rules) => {
    if (rules.required && (!value || value === '')) {
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
    return true;
};

// 表單驗證
const nameError = computed(() => validateField('name', name.value, { required: true }));
const emailError = computed(() => validateField('email', email.value, { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }));
const passwordError = computed(() => validateField('password', password_raw.value, { required: true }));
const textError = computed(() => validateField('text', text.value, { required: false }));

// 檢查整個表單是否有效
const isFormValid = computed(() => {
    return nameError.value && emailError.value && passwordError.value && textError.value;
});

const validData = async () => {
    let url = "https://script.google.com/macros/s/AKfycbwQGQY4CAhuYzI5AoAzsbWx4-aXTAONiZXpXq7Ue3MkojbgbvuKnDWXLk8wDZJLyx7P_g/exec";

    // data 驗證
    try {
        const response = await axios.get(url, {
            params: {
                table: "clubs"
            }
        });

        console.log("get clubs data:");
        console.log(response.data);

        const data = response.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i]["email"] === email.value) {
                console.log("data conflict.");
                isError.value = true;
                pageMsg.value = "電子信箱或電話號碼已經被註冊過了。";
                was_validated.value = false;
                return false; // 衝突，不通過
            }
        }

        console.log("data valid passed.");
        return true; // 通過
    } catch (error) {
        console.error("Error validating form:", error);
        return false; // 出錯時不通過
    }
}

// 清空表單的函數
const clearForm = () => {
    name.value = "";
    email.value = "";
    password_raw.value = "";
    text.value = "";
};
</script>
<template>
    <div>
        <h1>社團帳號註冊</h1>
        <!-- 顯示註冊結果訊息 -->
        <div v-if="pageMsg" class="mt-3 alert-dismissible"
            :class="['alert', isError ? 'alert-danger' : 'alert-success']" role="alert">
            {{ pageMsg }}
            <button type="button" class="btn-close" @click="pageMsg = '';"></button>
        </div>
        <form class="row g-3 my-3 needs-validation" :class="{ 'was-validated': was_validated }"
            @submit.prevent="sendForm" novalidate>
            <div class="col-md-6">
                <input type="text" v-model="name" class="form-control" :class="{ 'is-invalid': !nameError }" name="name"
                    id="name" placeholder="社團名稱" required>
                <div class="invalid-feedback">{{ errors.name }}</div>
            </div>
            <div class="col-md-6">
                <input type="email" v-model="email" class="form-control" :class="{ 'is-invalid': !emailError }"
                    name="email" id="email" placeholder="電子郵件" required>
                <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <div class="col-md-6">
                <input type="password" v-model="password_raw" class="form-control"
                    :class="{ 'is-invalid': !passwordError }" name="password" id="password" placeholder="密碼" required>
                <div class="invalid-feedback">{{ errors.password }}</div>
            </div>
            <div class="col-md-6">
                <input type="text" v-model="text" class="form-control" :class="{ 'is-invalid': !textError }"
                    name="password" id="text" placeholder="蓋章的字">
                <div class="invalid-feedback">{{ errors.text }}</div>
            </div>
            <div class="col-6 d-grid mx-auto">
                <button type="submit" class="btn btn-primary" :disabled="!isFormValid || isLoading">{{ isLoading ?
                    '提交中...' : '註冊' }}</button>
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