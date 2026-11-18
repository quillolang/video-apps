<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

let score = reactive({ red: 0, blue: 0 })
const target = ref(5)

const leader = computed(() =>
  score.red === score.blue ? 'Tied' : score.red > score.blue ? 'Red leads' : 'Blue leads',
)
const winner = computed(() =>
  score.red >= target.value ? 'Red wins!' : score.blue >= target.value ? 'Blue wins!' : null,
)

function point(team: 'red' | 'blue') {
  score[team]++
}

function newGame() {
  score = reactive({ red: 0, blue: 0 })
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
