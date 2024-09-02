<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import createQRcode from '@/components/createQRcode.vue';

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.isLoggedIn || !authStore.is_club) {
    router.push({ name: 'club_login' });
}

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
        <h1>
            {{ authStore.name }}
        </h1>
        <div class="my-4">
            <div class="card-btn card mb-2" data-bs-toggle="collapse" data-bs-target="#collapseExample"
                aria-expanded="false" aria-controls="collapseExample">
                <div class="card-body icon-link icon-link-hover"
                    style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
                    邀請朋友參加大地遊戲！
                    <i class="fa-solid fa-share-from-square bi ms-auto"></i>
                </div>
            </div>
            <div class="collapse mb-3 mx-auto" id="collapseExample">
                <div class="card card-body">
                    <createQRcode url="https://ttussc.github.io/Earth_Game" />
                </div>
            </div>
            <div v-if="authStore.access_priv" class="card-btn card mb-2" @click="router.push({ name: 'scan' });">
                <div class="card-body icon-link icon-link-hover"
                    style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
                    趕快去幫新生蓋章！
                    <i class="fa-solid fa-stamp bi ms-auto"></i>
                </div>
            </div>
            <div v-if="authStore.access_priv" class="card-btn card mb-2" @click="router.push({ name: 'club_edit' });">
                <div class="card-body icon-link icon-link-hover"
                    style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
                    修改社團帳號資料
                    <i class="fa-solid fa-stamp bi ms-auto"></i>
                </div>
            </div>
            <div class="card-btn card mb-2">
                <div class="card-body icon-link icon-link-hover"
                    style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);" data-bs-toggle="modal"
                    data-bs-target="#logoutModal">
                    我要登出了
                    <i class="fa-solid fa-right-from-bracket bi ms-auto"></i>
                </div>
            </div>
        </div>
        <hr>
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