<script setup>
import api from "../Api.js";
import {ref} from "vue";
import {emitter} from "@/Emitter.js";

const content = ref("")
const isDialogActive = ref(false) // Управляем состоянием модалки

async function postBlog() {
  const response = await api.post("/blog", {
    content: content.value,
  })
  if (response.data.content === content.value) {
    emitter.emit("create-blog", response.data)
    isDialogActive.value = false // Закрыть модалку
    content.value = "" // Очистить форму, по желанию
  }
}
</script>

<template>
  <v-dialog max-width="500" v-model="isDialogActive" >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          variant="outlined"
          prepend-icon="mdi-package-variant-closed-plus"
          size="large"
          v-bind="activatorProps"
      >
        Create blog
      </v-btn>
    </template>

    <v-card >
      <v-toolbar title="Create blog"></v-toolbar>

      <v-textarea label="Blog" variant="solo-filled" v-model="content"></v-textarea>

      <v-card-actions class="justify-end">
        <v-btn text="Cancel" @click="isDialogActive = false"></v-btn>
        <v-btn class="bg-primary" text="POST!" @click="postBlog"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
