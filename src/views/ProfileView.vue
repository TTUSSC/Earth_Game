<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<template>
  <div class="container w-75">
    <h1>Profile</h1>
    <span>{{ route.params.id }}</span>
  </div>
</template>
