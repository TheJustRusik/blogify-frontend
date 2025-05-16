<script setup>
import { RouterView } from 'vue-router'
import Header from "@/components/Header.vue";
</script>

<template>
  <div class="fixed z-1 w-full backdrop-blur-md">
  <Header />
  </div>
  <main class="pt-custom">
  <RouterView />
  </main>
</template>

<style scoped>
.pt-custom {
  padding-top: 7rem;
}

@media (min-width: 768px) {
  .pt-custom {
    padding-top: 5rem;
  }
}
</style>