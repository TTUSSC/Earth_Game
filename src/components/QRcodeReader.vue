<template>
    <div class="card" style="overflow: hidden;">
        <div class="card-body p-0" style="overflow: hidden;">
            <div class="ratio ratio-1x1" id="qr-reader" v-if="!scanComplete"></div>
        </div>
    </div>
    <div class="d-grid col-6 mx-auto my-4">
        <button :class="btn_class" type="button" @click="toggleCamera">{{ btn_text }}</button>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Html5Qrcode } from "html5-qrcode"
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();

const scanComplete = ref(false)
const result = ref('')
let html5QrCode = null

const emit = defineEmits(['scan-success'])

const initScanner = () => {
    if (!authStore.isLoggedIn || !authStore.is_club) return;
    try {
        html5QrCode = new Html5Qrcode("qr-reader")
        const containerWidth = document.getElementById('qr-reader').offsetWidth;
        const containerHeight = document.getElementById('qr-reader').offsetHeight;

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
            width: containerWidth * 0.7,
            height: containerHeight * 0.7
        }

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            onScanSuccess,
            onScanFailure
        )
    } catch (error) {
        console.log('init scanner failed: ' + error);
        btn_class.value = 'btn btn-primary';
        btn_text.value = '開啟相機';
        camera_is_opened.value = !camera_is_opened.value;
    }
}

const onScanSuccess = (decodedText) => {
    result.value = decodedText
    // 可以在這裡處理掃描成功後的邏輯
    emit('scan-success', decodedText);
}

const onScanFailure = (error) => {
    // 處理掃描失敗的情況
    //console.warn(`QR Code scanning failed: ${error}`);
}

onMounted(() => {
    toggleCamera();
});

onBeforeUnmount(() => {
    stopScanner();
});

const stopScanner = async () => {
    if (html5QrCode) {
        try {
            await html5QrCode.stop()
        } catch (error) {
            console.error("Failed to stop scanner:", error)
        }
    }
}

const camera_is_opened = ref(false);
const btn_class = ref('btn btn-primary');
const btn_text = ref('關閉相機');

const toggleCamera = async () => {
    camera_is_opened.value = !camera_is_opened.value;
    if (camera_is_opened.value) {
        initScanner();
        btn_class.value = 'btn btn-danger';
        btn_text.value = '關閉相機';
    } else {
        stopScanner();
        btn_class.value = 'btn btn-primary';
        btn_text.value = '開啟相機';
    }
}
</script>
<style>
#qr-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#qr-reader video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
}

#qr-reader canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>