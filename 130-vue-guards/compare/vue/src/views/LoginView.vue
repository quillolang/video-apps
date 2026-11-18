<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const name = ref('')
const password = ref('')
const wrong = ref(false)

async function submit() {
  wrong.value = !(await auth.logIn(name.value, password.value))
  if (!wrong.value) router.push(route.query.next ?? '/admin')
}
</script>

<template>
  <h1>Staff log in</h1>
  <form @submit.prevent="submit">
    <label>Name <input v-model="name" /></label>
    <label>Password <input v-model="password" type="password" /></label>
    <button>Log in</button>
  </form>
  <p v-if="wrong" class="error">Wrong password</p>
</template>
