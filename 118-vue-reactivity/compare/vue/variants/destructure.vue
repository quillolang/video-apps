<script setup>
import { computed, reactive, ref } from 'vue'

const score = reactive({ red: 0, blue: 0 })
const { red, blue } = score
const target = ref(5)

const leader = computed(() =>
  score.red === score.blue ? 'Tied' : score.red > score.blue ? 'Red leads' : 'Blue leads',
)
const winner = computed(() =>
  score.red >= target.value ? 'Red wins!' : score.blue >= target.value ? 'Blue wins!' : null,
)

function point(team) {
  score[team]++
}

function newGame() {
  score.red = 0
  score.blue = 0
}
</script>

<template>
  <main>
    <h1>Game Night</h1>
    <div class="teams">
      <button class="red" @click="point('red')">Red {{ red }}</button>
      <button class="blue" @click="point('blue')">Blue {{ blue }}</button>
    </div>
    <p class="leader">First to {{ target }}. {{ leader }}</p>
    <p v-if="winner" class="winner">{{ winner }}</p>
    <button class="new" @click="newGame">New game</button>
  </main>
</template>
