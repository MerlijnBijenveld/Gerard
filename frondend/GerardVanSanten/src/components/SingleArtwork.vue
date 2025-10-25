<script setup>
import { ref } from 'vue'

defineProps({
  artwork: String,
  isArticle: Boolean,
})

const isOpen = ref(false)

function openViewer() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeViewer() {
  isOpen.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <div>
    <img :src="artwork" class="article-img" @click="openViewer" alt="Artwork" />

    <div v-if="isOpen" class="image-viewer" @click.self="closeViewer">
      <img :src="artwork" class="viewer-img" alt="Expanded view" />
    </div>
  </div>
</template>

<style scoped>
.article-img {
  height: auto;
  max-height: 500px;
  object-fit: contain;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  width: 100%;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.article-img:hover {
  transform: scale(1.03);
}

.image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: zoom-out;
}
.viewer-img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 10px;
  object-fit: contain;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
}
</style>
