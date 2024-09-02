<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRecordsStore } from '@/stores/useRecordsStore';

const router = useRouter();
const authStore = useAuthStore();
const recordsStore = useRecordsStore();

recordsStore.callAPI();

if (!authStore.isLoggedIn || !authStore.is_club) {
    router.push({ name: 'club_login' });
}

authStore.update_club_auth();
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

const content = ref();
const remainingHeight = ref(0);
const calculateRemainingHeight = () => {
    if (content.value) {
        const tabContentRect = content.value.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        remainingHeight.value = windowHeight - tabContentRect.top - 110;
        console.log("剩餘高度：", remainingHeight.value);
    }
};

onMounted(() => {
    calculateRemainingHeight();
    window.addEventListener('resize', calculateRemainingHeight);
});
</script>
<template>
    <div ref="content">
        <h1>
            {{ authStore.name }}
        </h1>
        <hr>
        <div class="my-2">總點數：{{ authStore.records_len }}</div>
        <div class="progress my-3" role="progressbar" aria-label="Example with label" aria-valuenow="25"
            aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar"
                :style="{ 'width': authStore.records_len / recordsStore.data.length * 100 + `%` }">
                {{ Math.round(authStore.records_len / recordsStore.data.length * 10000) / 100 }} %
            </div>
        </div>
        <div class="mb-2">攤位參與人數佔總參與人數的 {{ Math.round(authStore.records_len / recordsStore.data.length * 10000) / 100 }}
            %</div>
        <div class="overflow-auto my-2" :style="{
            maxHeight: remainingHeight - 140 + `px`
        }">
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

<style scoped>
.card-btn:hover {
    font-weight: bold;
    cursor: pointer;
}
</style>