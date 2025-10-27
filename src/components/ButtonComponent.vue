<script setup>
import { computed } from 'vue'

const props = defineProps({
  direction: { type: String, required: true }, // "left" or "right"
  images: { type: Array, default: () => [] },
  width: { type: Number, required: true },
  prev: { type: Function, required: true },
  next: { type: Function, required: true },
})

const show = computed(() => props.images.length > 1 && props.width < 550)

const label = computed(() => (props.direction === 'left' ? 'Previous' : 'Next'))

const symbol = computed(() => (props.direction === 'left' ? '‹' : '›'))

const handler = () => (props.direction === 'left' ? props.prev() : props.next())
</script>

<template>
  <button
    v-if="show"
    class="article-nav"
    :class="direction"
    @click.stop.prevent="handler"
    :aria-label="label"
  >
    {{ symbol }}
  </button>
</template>
<style scoped>
.article-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  font-size: 28px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
}
</style>
