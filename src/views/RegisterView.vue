<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

let name = ref("");
let nick_name = ref("");
let email = ref("");
let phone = ref("");
let password = ref("");
let formCheck = ref(false);

const isLoading = ref(false);
const registrationMessage = ref('');
const isError = ref(false);

// 添加錯誤信息
const errors = ref({
    name: '',
    nick_name: '',
    email: '',
    phone: '',
    password: '',
    check: ''
});

var was_validated = ref(false);

const sendForm = async () => {
    was_validated.value = true;
    isLoading.value = true;
    try {
        const isValid = await validForm();
        if (isValid) {
            const formData = new FormData();
            formData.append("entry.1936143612", name.value);
            formData.append("entry.1883933211", nick_name.value);
            formData.append("entry.2093473455", email.value);
            formData.append("entry.1241463021", phone.value);

            await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSfijitS0keu4OKn0P6PdaVg_R9QGPwsP5jl7Wa7RIOnNeNYbA/formResponse', {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
            console.log('Form submitted successfully')
            isError.value = false;
            registrationMessage.value = "註冊成功！";
            clearForm();
            router.push({
                name: 'stamp'
            });
        } else {
            console.log("驗證失敗或未勾選同意條款")
        }
    } catch (error) {
        isError.value = true;
        registrationMessage.value = "註冊表單錯誤：" + error;
        console.error("Error submitting form:", error);
        // 處理錯誤，比如顯示錯誤消息
    } finally {
        isLoading.value = false;
    }

    // 檢查有沒有上傳成功
    // if (checkSubmit()) {
    //     console.log("submit successed!");
    // } else {
    //     console.log("submit failed!");
    // }
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
    return true;
};

// 表單驗證
const nameError = computed(() => validateField('name', name.value, { required: true }));
const nickNameError = computed(() => validateField('nick_name', nick_name.value, { required: false }));
const emailError = computed(() => validateField('email', email.value, { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }));
const phoneError = computed(() => validateField('phone', phone.value, { required: true, pattern: /^\d{10}$/ }));
//const passwordError = computed(() => validateField('password', password.value, { required: true, minLength: 6 }));
const checkError = computed(() => validateField('check', formCheck.value, { required: true }));

// 檢查整個表單是否有效
const isFormValid = computed(() => {
    // return nameError.value && nickNameError.value && emailError.value &&
    //     phoneError.value && passwordError.value && checkError.value;
    return nameError.value && nickNameError.value && emailError.value &&
        phoneError.value && checkError.value;
});

async function validForm() {
    let url = "https://script.google.com/macros/s/AKfycbwQGQY4CAhuYzI5AoAzsbWx4-aXTAONiZXpXq7Ue3MkojbgbvuKnDWXLk8wDZJLyx7P_g/exec";
    var formValid = true;

    // 欄位驗證
    if (!isFormValid.value) {
        return false;
    }

    // data 驗證
    try {
        const response = await axios.get(url, {
            params: {
                table: "users"
            }
        });

        console.log("get users data:");
        console.log(response.data);

        const data = response.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i]["email"] === email.value || data[i]['phone_number'] === phone.value) {
                console.log("data conflict.");
                isError.value = true;
                registrationMessage.value = "電子信箱或電話號碼已經被註冊過了。";
                was_validated.value = false;
                return false; // 衝突，不通過
            }
        }

        console.log("data valid passed.");
        return true && formValid; // 通過
    } catch (error) {
        console.error("Error validating form:", error);
        return false && formValid; // 出錯時不通過
    }
}

// 清空表單的函數
const clearForm = () => {
    name.value = "";
    nick_name.value = "";
    email.value = "";
    phone.value = "";
    password.value = "";
    formCheck.value = false;
};
</script>
<template>
    <div>
        <h1>註冊</h1>
        <!-- 顯示註冊結果訊息 -->
        <div v-if="registrationMessage" class="mt-3" :class="['alert', isError ? 'alert-danger' : 'alert-success']"
            role="alert">
            {{ registrationMessage }}
        </div>
        <form class="row g-3 my-3 needs-validation" :class="{ 'was-validated': was_validated }"
            @submit.prevent="sendForm" novalidate>
            <div class="col-md-6">
                <input type="text" v-model="name" class="form-control" :class="{ 'is-invalid': !nameError }" name="name"
                    id="name" placeholder="姓名" required>
                <div class="invalid-feedback">{{ errors.name }}</div>
            </div>
            <div class="col-md-4">
                <input type="text" v-model="nick_name" class="form-control" :class="{ 'is-invalid': !nickNameError }"
                    name="nick_name" id="nick_name" placeholder="暱稱" required>
                <div class="invalid-feedback">{{ errors.nick_name }}</div>
            </div>
            <div class="col-md-6">
                <input type="email" v-model="email" class="form-control" :class="{ 'is-invalid': !emailError }"
                    name="email" id="email" placeholder="電子郵件" required>
                <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <div class="col-md-6">
                <input type="tel" v-model="phone" class="form-control" :class="{ 'is-invalid': !phoneError }"
                    name="phone" id="phone" placeholder="電話號碼" required>
                <div class="invalid-feedback">{{ errors.phone }}</div>
            </div>
            <!-- <div class="col-md-6">
                <input type="password" v-model="password" class="form-control" :class="{ 'is-invalid': !passwordError }"
                    name="password" id="password" placeholder="密碼" required>
                <div class="invalid-feedback">{{ errors.password }}</div>
            </div> -->
            <div class="col-12">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" :class="{ 'is-invalid': !checkError }"
                        v-model="formCheck" id="gridCheck" required>
                    <label class="form-check-label" for="gridCheck">
                        同意資料使用條款
                    </label>
                    <div class="invalid-feedback">{{ errors.check }}</div>
                </div>
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