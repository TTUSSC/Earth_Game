<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <div>
        <h1>遊戲規則</h1>
        <div class="my-4">
            <p>
                每個人最多可以<mark>獲得 2 張抽獎券</mark>，得到 2 張抽獎券的人可以抽到大獎，得到 1 張抽獎券的可以參加普獎抽獎。
            </p>
            <p><mark><strong>每個人會以抽到的最大獎為優先，不得重複領獎。</strong></mark></p>
            <h3>獲得點數的方式</h3>
            <p>
            <ol class="list-style">
                <li>在各社團攤位進行活動</li>
                <li>在各社團攤位進行打卡，並標記 <a class="" style="text-decoration: none;">#TTU社團博覽會</a>
                </li>
            </ol>
            </p>
            <h3>獲取抽獎券的條件</h3>
            <p>
                <strong>第一張抽獎券獲得資格</strong><br>
                在<mark>不同社團攤位</mark>分別獲得 1 個活動點數，需集滿 2 點
            </p>
            <p>
                <strong>第二章張獎券獲得資格</strong><br>
                除了以上 2 個社團，另找1個社團<mark>發 IG 限動/po 文</mark>，可再得 1 點
            </p>
            <h3>抽獎</h3>
            <p>
                活動結束後<mark>於學生會 IG 直播在白宮前的抽獎大會</mark>，也歡迎同學於現場看抽獎過程，獲獎者請關注
                <a href="http://instagram.com/tatung_sa" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-instagram"></i>
                    學生會 IG
                </a>
                公告領獎時間，屆時再請至學生會辦公室領取獎品，詳情待學生會公告相關資訊。
            </p>
            <div class="container my-4 d-flex">
                <button class="btn btn-primary btn-lg mx-auto" @click="router.push({ name: 'stamp' });">
                    參與集點活動！
                </button>
            </div>
        </div>
    </div>
</template>