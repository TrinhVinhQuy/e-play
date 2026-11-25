<script setup>
import { store } from '../store'
import { SUBJECTS } from '../games'
import { sfx } from '../utils/sound'

function choose(id) {
  if (store.subject === id) return
  sfx.click()
  store.subject = id
}
</script>

<template>
  <div class="switch">
    <button
      v-for="s in SUBJECTS"
      :key="s.id"
      :class="{ active: store.subject === s.id }"
      :style="{ '--s': s.color }"
      @click="choose(s.id)"
    >
      <span class="ic">{{ s.icon }}</span> {{ s.name }}
    </button>
  </div>
</template>

<style scoped>
.switch {
  display: inline-flex;
  align-self: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  padding: 6px;
  gap: 6px;
  box-shadow: var(--shadow);
}
button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 22px;
  border-radius: 999px;
  font-size: 1.3rem;
  font-weight: 800;
  background: transparent;
  color: #57606f;
  transition: all 0.2s;
}
button.active {
  background: var(--s);
  color: #fff;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
}
.ic { font-size: 1.5rem; }
</style>
