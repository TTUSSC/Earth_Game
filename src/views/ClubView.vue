<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import createQRcode from '@/components/createQRcode.vue';

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.isLoggedIn || !authStore.is_club) {
    router.push({ name: 'club_login' });
}

authStore.update_club_auth();
authStore.get_club_records();
</script>

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
            <div v-if="authStore.access_priv" class="card-btn card mb-2"
                @click="router.push({ name: 'club_records' });">
                <div class="card-body icon-link icon-link-hover"
                    style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
                    蓋章紀錄
                    <i class="fa-solid fa-database bi ms-auto"></i>
                </div>
            </div>
            <div v-if="authStore.access_priv" class="card-btn card mb-2" @click="router.push({ name: 'club_edit' });">
                <div class="card-body icon-link icon-link-hover"
                    style="--bs-icon-link-transform: translate3d(0, -.25rem, 0);">
                    修改社團帳號資料
                    <i class="fa-solid fa-pen-to-square bi ms-auto"></i>
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