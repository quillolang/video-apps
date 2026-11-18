import { ref } from 'vue'
import { defineStore } from 'pinia'

// Signed in or not, remembered in the browser so a reload keeps it.
export const useAuthStore = defineStore('auth', () => {
  const signedIn = ref(localStorage.getItem('signedIn') === '1')

  async function logIn(name, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    })
    if (!res.ok) return false
    signedIn.value = true
    localStorage.setItem('signedIn', '1')
    return true
  }

  return { signedIn, logIn }
})
