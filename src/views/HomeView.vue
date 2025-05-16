<template>
  <main class="  mt-2 space-y-2">
    <v-infinite-scroll :items="blogs" @load="loadBlogs" class="">
      <Blog
          v-for="blog in blogs"
          :key="blog.id"
          :blog-id="blog.id"
          :author-name="users[blog.ownerId]?.username || '...' "
          :author-status="users[blog.ownerId]?.status || ''"
          :content="blog.content"
          :like-count="blog.likeCount"
          :comment-count="blog.commentCount"
          :author-avatar-url="'https://api.dicebear.com/8.x/adventurer/svg?seed=' + (users[blog.ownerId]?.username || '')"
          class="mb-2 max-w-screen-lg mx-auto w-full"
      />
    </v-infinite-scroll>
  </main>
</template>

<script setup>
import Blog from '@/components/Blog.vue';
import api from '../Api.js'
import {ref, onMounted} from "vue";
import {emitter} from "@/Emitter.js";

const blogs = ref([]);
const page = ref(0)
const users = ref({});

async function loadUsers(ids) {
  const response = await api.post('/user/all', ids);
  const data = response.data;

  for (let user of data) {
    console.log("loadUsers");
    users.value[user.id] = user;
  }
}

emitter.on("create-blog", (content) => {
      console.log("create-blog", content);
      blogs.value.unshift(content)
      loadUsers(Array.of(content.ownerId));
    }
)

async function loadBlogs({done}) {
  console.log("loadBlogs");
  try {
    const response = await api.get('/blog', {
      params: {
        pageNum: page.value,
        pageSize: 10,
        criteria: 'LIKE',
        direction: 'DESC'
      }
    })
    page.value++;
    if (response.data.length > 0) {
      blogs.value.push(...response.data)
      done('ok')
    } else {
      done('empty')
    }
    console.log(blogs.value)

    let userIds = []
    for (let blog of response.data) {
      console.log("RESPONSE DATA")
      if (!userIds.includes(blog.ownerId)) {
        userIds.push(blog.ownerId)
      }

    }
    console.log(userIds)
    await loadUsers(userIds)
  } catch (error) {
    console.error('Ошибка при загрузке блогов:', error)
  }

}


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
}
</style>