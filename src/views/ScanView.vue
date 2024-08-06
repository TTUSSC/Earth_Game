<script setup>
import { ref } from 'vue';
import QRcodeReader from '@/components/QRcodeReader.vue';

const account = ref('');

const handleScanSuccess = (data) => {
    account.value = data
    pageMsg.value = '掃描成功';
}

const pageMsg = ref('');
const isError = ref(false);
</script>
<template>
    <div>
        <h1 class="mb-4">Scan</h1>
        <div v-if="pageMsg" class="mt-3" :class="['alert', isError ? 'alert-danger' : 'alert-success']" role="alert">
            {{ pageMsg }}
        </div>
        <QRcodeReader @scan-success="handleScanSuccess" />
    </div>
</template>
