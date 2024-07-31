<script setup>
import { ref } from 'vue';
import axios from 'axios';

let name = ref(" ");
let nick_name = ref("");
let email = ref("");
let phone = ref("");

const sendForm = () => {
    const formData = new FormData();
    formData.append("entry.1936143612", name.value);
    formData.append("entry.1883933211", nick_name.value);
    formData.append("entry.2093473455", email.value);
    formData.append("entry.1241463021", phone.value);

    fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSfijitS0keu4OKn0P6PdaVg_R9QGPwsP5jl7Wa7RIOnNeNYbA/formResponse', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(() => {
        console.log('Form submitted successfully')
        // 清空表單或顯示成功信息
    }).catch(error => {
        console.error('Error submitting form:', error)
        // 顯示錯誤信息
    })
}
</script>
<template>
    <div>
        <h1>註冊</h1>
        <form class="row g-3 my-3" @submit.prevent="sendForm">
            <div class="col-md-6">
                <input type="text" v-model="name" class="form-control" id="name" placeholder="姓名" required>
            </div>
            <div class="col-md-4">
                <input type="text" v-model="nick_name" class="form-control" id="nick_name" placeholder="暱稱" required>
            </div>
            <div class="col-md-6">
                <input type="email" v-model="email" class="form-control" id="email" placeholder="電子郵件" required>
            </div>
            <div class="col-md-6">
                <input type="tel" v-model="phone" class="form-control" id="phone" placeholder="電話號碼" required>
            </div>
            <div class="col-12">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="gridCheck">
                    <label class="form-check-label" for="gridCheck">
                        同意資料使用條款
                    </label>
                </div>
            </div>
            <div class="col-6 d-grid mx-auto">
                <button type="submit" class="btn btn-primary">註冊</button>
            </div>
        </form>
    </div>
</template>
