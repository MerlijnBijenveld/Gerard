<script setup>
import SingleArtwork from './SingleArtwork.vue'
import MultiArtworkViewer from './MultiArtworkViewer.vue'
defineProps({
  images: { type: Array, required: true },
  isArticle: { type: Boolean, default: false },
  items: { type: Number, default: 1 },
})
</script>

<template>
  <div class="artwork-showcase">
    <SingleArtwork v-if="images.length === 1" :artwork="images[0]" :isArticle="isArticle" />
    <MultiArtworkViewer v-else :images="images" :isArticle="isArticle" :items="items" />
  </div>
</template>

<style scoped>
.artwork-showcase {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
