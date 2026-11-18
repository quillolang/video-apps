<script setup lang="ts">
import { computed, ref } from 'vue'

const score = ref({ red: 0, blue: 0 })
const target = ref(5)

const leader = computed(() => {
  const { red, blue } = score.value
  return red === blue ? 'Tied' : red > blue ? 'Red leads' : 'Blue leads'
})
const winner = computed(() => {
  const { red, blue } = score.value
  return red >= target.value ? 'Red wins!' : blue >= target.value ? 'Blue wins!' : null
})

function point(team: 'red' | 'blue') {
  score.value[team]++
}

function newGame() {
  score.value = { red: 0, blue: 0 }
}
</script>

<template>
  <main>
    <h1>Game Night</h1>
    <div class="teams">
      <button class="red" @click="point('red')">Red {{ score.red }}</button>
      <button class="blue" @click="point('blue')">Blue {{ score.blue }}</button>
    </div>
    <p class="leader">First to {{ target }}. {{ leader }}</p>
    <p v-if="winner" class="winner">{{ winner }}</p>
    <button class="new" @click="newGame">New game</button>
  </main>
</template>
