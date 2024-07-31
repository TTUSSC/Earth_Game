<script setup>
const props = defineProps({
  'url': String,
})

var qrapi = "https://quickchart.io/qr?size=1080&margin=2&text=";
console.log(qrapi + props.url)
</script>
<template>
  <img class="qrcode img-fluid rounded" :src="qrapi + props.url" alt="" />
</template>
<style></style>
