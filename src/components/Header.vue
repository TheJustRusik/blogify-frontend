<script setup>
import RotatingCube from "@/components/RotatingCube.vue";
import {useTheme} from 'vuetify'
import {ref, onMounted} from "vue";
import api from "../Api.js";
import BlogCreator from "@/components/BlogCreator.vue";
import {emitter} from "@/Emitter.js";

const isAuthed = ref(false)
const theme = useTheme()
const themeButtonIcon = ref('mdi-weather-sunny')
const password = ref("")
const email = ref("")
const username = ref("")
const status = ref("Nookie👉👈")
const showPassword = ref("")
const title = ref("Login")
const isLogin = ref(true)
const changeModeButtonText = ref("I don't have account")
const rules = {
  required: value => !!value || 'Required.',
  min: v => v.length >= 8 || 'Min 8 characters',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  themeButtonIcon.value = themeButtonIcon.value === 'mdi-weather-sunny' ? 'mdi-weather-night' : 'mdi-weather-sunny'
}

function changeAuth() {
  isLogin.value = !isLogin.value
  title.value = isLogin.value ? "Login" : "Register"
  changeModeButtonText.value = isLogin.value ? "I don't have account" : "I have account"
}

async function loginOrRegister() {
  if (isLogin.value) {
    login()
  } else {
    const respone = await api.post("/auth/register", {
      email: email.value,
      password: password.value,
      username: username.value,
    })
    if (respone.status === 200) {
      console.log("Success registration")
      await login()
    }
  }

}

async function login() {
  const response = await api.post("/auth/login", {
    email: email.value,
    password: password.value,
  })
  const data = response.data
  console.log(data)
  if (data.accessToken) {
    localStorage.setItem("token", data.accessToken)
    localStorage.setItem("email", email.value)
    const profile = await api.get("/user/me")
    console.log(profile.data)
    username.value = profile.data.username
    localStorage.setItem("username", username.value)
    isAuthed.value = true
  }
}

emitter.on("logout", () => {
  alert("logout")
  logout()
})

function logout() {
  localStorage.clear()
  isAuthed.value = false
}

onMounted(() => {
  email.value = localStorage.getItem('email');
  username.value = localStorage.getItem('username');

  if (localStorage.getItem('token')) {
    isAuthed.value = true
    console.log("You authed")
  }
})
</script>

<template>
  <header class="max-w-screen-lg mx-auto">
    <div class="flex justify-between items-center">
      <div class="md:flex justify-center items-center">
        <RotatingCube/>
        <div class="text-center md:text-left">
          <h1 class="text-lg md:text-4xl text-primary">Blogify</h1>
          <span class="hidden md:block text-sm text-secondary">by TheJustRusik</span>
        </div>
      </div>
      <div class="md:flex items-center gap-x-2">
        <div>
        <BlogCreator></BlogCreator>
        </div>

        <div v-if="isAuthed" class="flex items-center">
          <v-avatar
              color="surface-variant"
              :image="'https://api.dicebear.com/8.x/adventurer/svg?seed=' + username"
          ></v-avatar>
          <div class="ml-2 ">
            <div class="text-lg">{{ username }}</div>
            <div class="hidden sm:block text-sm">{{ email }}</div>
          </div>
          <v-btn
              class="ml-2"
              variant="flat"
              icon="mdi-logout"
              @click="logout"
          ></v-btn>
        </div>

        <v-dialog
            v-if="!isAuthed"
            max-width="500"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                size="large"
                variant="outlined"
                prepend-icon="mdi-login"
                v-bind="activatorProps"
            >Login <span class="text-primary">/</span> Register
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card>
              <v-toolbar :title="title"></v-toolbar>

              <v-text-field

                  variant="underlined"
                  prepend-inner-icon="mdi-email-outline"
                  class="mx-4 mt-5"
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  label="E-mail"
              ></v-text-field>
              <v-text-field
                  v-if="!isLogin"
                  variant="underlined"
                  prepend-inner-icon="mdi-account"
                  class="mx-4"
                  v-model="username"
                  :rules="[rules.required]"
                  label="Name"
              ></v-text-field>
              <v-text-field
                  variant="underlined"
                  class="mx-4"
                  v-model="password"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  hint="At least 8 characters"
                  label="Password"
                  name="input-10-1"
                  :rules="[rules.required, rules.min]"
                  counter
                  @click:append-inner="showPassword = !showPassword"
                  prepend-inner-icon="mdi-lock-outline"
              ></v-text-field>
              <v-btn
                  variant="outlined"
                  class="mx-auto max-w-18"
                  :text="changeModeButtonText"
                  @click="changeAuth"
              ></v-btn>

              <v-card-actions class="justify-end">
                <v-btn
                    text="Cancel"
                    @click="isActive.value = false"
                ></v-btn>
                <v-btn
                    class="bg-primary"
                    :text="title"
                    @click="loginOrRegister"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <div class="hidden md:block">

          <v-btn  variant="flat" :icon="themeButtonIcon" @click="toggleTheme"/>
        </div>
      </div>
    </div>
  </header>


  <v-divider></v-divider>
</template>

<style scoped>

</style>