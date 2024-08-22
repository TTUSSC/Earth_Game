<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();
authStore.get_club_records();

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

<!-- 
1. 給別人蓋章
2. 鎖人家帳號
3. 看幫誰蓋章了？
-->

<template>
    <div>
        <h1>社團後台</h1>
        <div class="mb-2">總點數：{{ authStore.records_len }}</div>
        <div>
            <div class="card my-2" v-for="i in computed(() => authStore.records).value" :key="i.created_time">
                <div class="card-header d-flex align-items-center">
                    <span class="badge rounded-pill"
                        :class="{ 'text-bg-danger': i.is_ig, 'text-bg-primary': !i.is_ig, }">
                        {{ i.is_ig ? "限時動態" : "攤位集點" }}
                    </span>
                    <span>&nbsp;&nbsp;{{ time_formatter.format(new Date(i.created_time)) }}</span>
                </div>
                <div class="card-body">
                    <!-- <p v-if="i.club_stamp != ''">{{ i.club_stamp }}</p> -->
                    集點人：{{ i.user_name }}
                </div>
            </div>
        </div>
    </div>
</template>