<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

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
</script>
<template>
    <div>
        <h1>
            {{ authStore.name }}
        </h1>
        <div class="mb-2">總點數：{{ authStore.records_len }}</div>
        <div class="overflow-auto" :style="{
            maxHeight: + 400 + `px`
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

        <!-- Modal -->
        <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">登出確認</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>確認要登出帳號嗎？</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary mx-2" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger mx-2" data-bs-dismiss="modal"
                            @click="authStore.logout(); router.push('/');">
                            登出
                        </button>
                    </div>
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