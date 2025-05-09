<template>
  <main class="max-w-screen-lg mx-auto mt-2 space-y-2">
    <Blog
        v-for="blog in blogs"
        :author-name="users[blog.ownerId].username"
        :author-status="users[blog.ownerId].status"
        :content="blog.content"
        :like-count="blog.likeCount"
        :comment-count="blog.commentCount"
        :author-avatar-url="'https://api.dicebear.com/8.x/adventurer/svg?seed=' + users[blog.ownerId].username"
        class="mb-2"
    />
  </main>
</template>

<script setup>
import Blog from '@/components/Blog.vue';
import api from '../Api.js'
import {ref, onMounted} from "vue";

const blogs = ref([]);
const users = ref({});

async function loadUsers(ids) {
  const response = await api.post('/user/all', ids);
  const data = response.data;

  for (let user of data) {
    users.value[user.id] = user;
  }
}

const loadBlogs = async () => {
  try {
    const response = await api.get('/blog', {
      params: {
        pageNum: 0,
        pageSize: 10,
        criteria: 'LIKE',
        direction: 'ASC'
      }
    })
    blogs.value = response.data

    let userIds = []
    for (let blog of response.data) {
      userIds.push(blog.ownerId)
    }
    console.log(userIds)
    loadUsers(userIds)
  } catch (error) {
    console.error('Ошибка при загрузке блогов:', error)
  }
}

onMounted(() => {
  loadBlogs()
})

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
}
</style>