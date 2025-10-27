<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  artwork: {
    type: [String, Object],
    required: true,
  },
  isArticle: { type: Boolean, default: false },
})

const isOpen = ref(false)
function onKey(e) {
  if (e.key === 'Escape') closeViewer()
}
function openViewer() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
}

function closeViewer() {
  isOpen.value = false
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
}

// ensure scroll unlocks even if component unmounts
onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
const src = computed(() => {
  const a = props.artwork
  if (!a) return ''
  return typeof a === 'string' ? a : a.src || ''
})
const meta = computed(() => (typeof props.artwork === 'string' ? null : props.artwork || null))
</script>
<template>
  <div class="artwork-wrapper">
    <img
      :src="src"
      class="article-img"
      @click.stop.prevent="openViewer"
      :alt="meta?.title || 'Artwork'"
      loading="lazy"
      tabindex="0"
    />

    <!-- Teleport modal to body and use same layout as MultiArtworkViewer -->
    <teleport to="body">
      <transition name="fade-zoom">
        <div v-if="isOpen" class="viewer" @click.self="closeViewer" role="dialog" aria-modal="true">
          <button class="viewer-close" @click="closeViewer" aria-label="Close">✕</button>

          <div class="viewer-flex">
            <div class="viewer-section">
              <div
                class="viewer-image"
                :style="{
                  backgroundImage: src ? `url(${src})` : 'none',
                  backgroundSize: 'contain',
                }"
              >
                <div class="image-protector"></div>
              </div>

              <div class="viewer-text" v-if="!isArticle && meta">
                <h3 class="info-title">{{ meta.title }}</h3>
                <div class="info-meta">
                  <span v-if="meta.year">{{ meta.year }}</span>
                  <span v-if="meta.medium"> • {{ meta.medium }}</span>
                </div>
                <p class="info-desc" v-if="meta.description">{{ meta.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.artwork-wrapper {
  position: relative;
}

/* Thumbnail */
.article-img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: contain;
  cursor: zoom-in;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.article-img:hover {
  transform: scale(1.03);
}

/* Modal viewer (matches MultiArtworkViewer layout) */
.viewer {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.9);
  z-index: 2200;
  padding: 32px;
}

.viewer-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  max-width: 1100px;
}

.viewer-section {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  background: rgba(25, 25, 25, 0.95);
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  height: min(80vh, 800px);
}

/* image column uses background so it fills space similarly to MultiArtworkViewer */
.viewer-image {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 55%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  min-height: 320px;
}

.image-protector {
  width: 100%;
  height: 100%;
}

/* text column */
.viewer-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1 1 45%;
  padding: 40px;
  color: #fff;
}
.info-title {
  margin: 0 0 0.4rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent);
}
.info-meta {
  color: var(--muted-gray);
  margin-bottom: 0.75rem;
}
.info-desc {
  color: var(--text-gray);
  line-height: 1.5;
}

/* Close button */
.viewer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 22px;
  right: 22px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  font-size: 18px;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  cursor: pointer;
}
.viewer-close:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Transition */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

@media (max-width: 1000px) {
  .viewer-section {
    flex-direction: column;
    height: auto;
  }
  .viewer-flex {
    width: 90%;
  }
}
@media (max-width: 600px) {
  .viewer-image {
    height: 50vh;
  }
  .viewer-text {
    padding: 24px;
  }
}
</style>
