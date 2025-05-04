<template>
  <header class="py-4 flex justify-between">
    <div class="flex justify-center items-center">
      <RotatingCube />
      <h1 class="text-4xl text-white">Blogify</h1>
    </div>
    <v-btn></v-btn>
  </header>
  <v-divider
    class="mx-8"
  ></v-divider>
  <main>
    <Blog></Blog>
  </main>
</template>

<script setup>
// <RouterLink to="/about">About</RouterLink>
import RotatingCube from '@/components/RotatingCube.vue';
import Blog from '@/components/Blog.vue';

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
}
</style>