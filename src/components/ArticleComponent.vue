<script setup>
import ArtworkComponent from './ArtworkComponent.vue'

defineProps({
  articles: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="article-list">
    <article
      v-for="(a, i) in articles"
      :key="a.id || i"
      :class="['article', i % 2 ? 'reverse' : '']"
    >
      <div class="article-image" v-if="a.image">
        <ArtworkComponent :images="a.image" :is-article="true" :items="1" />
      </div>
      <div class="article-content">
        <h3 class="article-title">{{ a.title }}</h3>
        <div class="article-date">{{ a.date }}</div>
        <p class="article-description">{{ a.description }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  max-width: 1100px;
  margin: 4rem auto;
  padding: 0 1.5rem;
}

.article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 18px;
  padding: 2rem;
  transition: background 0.3s ease;
}

.article:hover {
  background: rgba(255, 255, 255, 0.06);
}

.article.reverse {
  flex-direction: row-reverse;
}

.article-image {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 275px;
  padding-right: 50px;
  padding-left: 50px;
}

.article-img {
  height: auto;
  max-height: 500px;
  object-fit: contain;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  width: 100%;
  border-radius: 12px;
}

.article-img:hover {
  transform: scale(1.03);
}

.article-content {
  flex: 1;
  color: var(--accent, #fff);
}

.article-title {
  margin: 0 0 0.4rem;
  font-size: 1.8rem;
  font-weight: 700;
}

.article-date {
  color: var(--muted-gray, #aaa);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.article-description {
  color: var(--text-gray, #ccc);
  line-height: 1.6;
  font-size: 1.05rem;
}

/* Fullscreen viewer */
.image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.25s ease;
  cursor: zoom-out;
}

.viewer-img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 10px;
  object-fit: contain;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
  animation: zoomIn 0.25s ease;
}

/* Arrows inside fullscreen viewer */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2100;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}
.nav-btn.left {
  left: 20px;
}
.nav-btn.right {
  right: 20px;
}
.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Bullets under the image */
.viewer-bullets {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2100;
}
.viewer-bullets .bullet {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background 0.2s ease;
}
.viewer-bullets .bullet.active {
  background: #fff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0.7;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 800px) {
  .article {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  .article.reverse {
    flex-direction: column;
  }
  .article-img {
    max-height: 350px;
  }
}
</style>
