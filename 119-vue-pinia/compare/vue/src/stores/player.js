import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', () => {
  const now = ref(null)
  const queue = ref([])

  function play(track) {
    now.value = track
  }

  function enqueue(track) {
    queue.value = [...queue.value, track]
  }

  return { now, queue, play, enqueue }
})
