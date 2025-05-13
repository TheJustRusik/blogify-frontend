<template>
  <div class="flex">
    <v-card
        :title="authorName"
        :subtitle="authorStatus"
        class="w-full"
        elevation="24"
    >
      <template v-slot:prepend>
        <v-avatar
            color="surface-variant"
            :image="authorAvatarUrl"
        ></v-avatar>
      </template>

      <v-card-text class="text-h5 py-2">
        {{ content }}
      </v-card-text>

      <v-card-actions>
        <v-list-item class="w-100">
          <template v-slot:append>
            <div class="justify-self-end">
              <v-btn :icon="likeButtonIcon" @click="like"></v-btn>
              <span class="me-2">{{ localLikeCount }}</span>
              <v-btn @click="showComments = !showComments" icon="mdi-comment-text-outline"></v-btn>
              <span class="">{{ commentCount }}</span>
            </div>
          </template>
        </v-list-item>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import {ref} from "vue";
import api from "@/Api.js";

const props = defineProps({
  blogId: String,
  authorName: String,
  authorStatus: String,
  authorAvatarUrl: String,
  content: String,
  likeCount: Number,
  commentCount: Number,
})

const blogId = ref(props.blogId)
const showComments = ref(false)
const likeButtonIcon = ref("mdi-heart-outline")
const isLiked = ref(false)
const localLikeCount = ref(props.likeCount)

async function like() {
  let response = await api.patch(`/blog/like/${blogId.value}`)
  if (response.data === "Added like") {
    isLiked.value = true
    likeButtonIcon.value = isLiked.value ? "mdi-heart" : "mdi-heart-outline"
    localLikeCount.value += isLiked.value ? 1 : -1
  }else if (response.data === "Removed like") {
    isLiked.value = false
    likeButtonIcon.value = isLiked.value ? "mdi-heart" : "mdi-heart-outline"
    localLikeCount.value += isLiked.value ? 1 : -1
  }


}
</script>