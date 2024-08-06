<script setup>
import { ref } from 'vue';
import QRcodeReader from '@/components/QRcodeReader.vue';

const scanResult = ref('');

const handleScanSuccess = (data) => {
    scanResult.value = data
    pageMsg.value = '掃描成功！' + scanResult.value;
}

const pageMsg = ref('');
const isError = ref(false);
</script>
<template>
    <div>
        <h1 class="mb-4">Scan</h1>
        <div v-if="pageMsg" class="mt-3 text-break" :class="['alert', isError ? 'alert-danger' : 'alert-success']"
            role="alert">
            {{ pageMsg }}
        </div>
        <QRcodeReader @scan-success="handleScanSuccess" />
    </div>
</template>
