<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<template>
  <div>
    <h1>Profile</h1>
    <span>{{ route.params.id }}</span>
  </div>
</template>
