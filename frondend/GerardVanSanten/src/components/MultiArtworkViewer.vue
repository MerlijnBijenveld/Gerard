<script setup>
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import { useLan } from '../Languages/LanguagesManager'

const { t } = useLan()

const props = defineProps({
  images: { type: Array, required: true },
  startIndex: { type: Number, default: 0 },
  isArticle: { type: Boolean, default: false },
  items: { type: Number, default: 1 },
})

const currentIndex = ref(Math.max(0, Math.min(props.startIndex, props.images.length - 1)))
const isOpen = ref(false)

watch(
  () => props.images.length,
  (len) => {
    if (currentIndex.value >= len) currentIndex.value = Math.max(0, len - 1)
  },
)

const item = computed(() => {
  const raw = props.images[currentIndex.value]
  if (!raw) return null
  return props.isArticle ? { src: raw } : raw
})

const bgStyleFull = computed(() => ({
  backgroundImage: item.value ? `url(${item.value.src || item.value})` : 'none',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundColor: 'rgba(0,0,0,0)',
}))

function open() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  window.requestAnimationFrame(() => window.addEventListener('keydown', onKey))
}
function openAt(index) {
  if (index == null || index < 0 || index >= props.images.length) return
  currentIndex.value = index
  open()
}
function close() {
  isOpen.value = false
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
}
function prev() {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}
function next() {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}
function onKey(e) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

const thumbStart = ref(0)
const visibleThumbs = computed(() => {
  if (props.items >= props.images.length) {
    return props.images
  }
  return props.images.slice(thumbStart.value, thumbStart.value + props.items)
})
function thumbPrev() {
  if (thumbStart.value > 0) thumbStart.value--
}
function thumbNext() {
  if (thumbStart.value + props.items < props.images.length) thumbStart.value++
}
</script>

<template>
  <!-- Thumbnails -->
  <div class="thumbnails">
    <div v-if="props.isArticle && props.images.length" class="article-thumb-container">
      <div class="article-thumb-wrap">
        <button
          v-if="props.images.length > 1"
          class="article-nav left"
          @click.stop.prevent="prev()"
          aria-label="Previous"
        >
          ‹
        </button>
        <div
          class="artwork-thumb"
          role="button"
          aria-label="Article image"
          @click="openAt(currentIndex)"
          tabindex="0"
        >
          <div
            class="thumb-image"
            :style="{
              backgroundImage: `url(${props.images[currentIndex]})`,
              backgroundSize: 'contain',
            }"
          >
            <div class="thumb-overlay"></div>
          </div>
        </div>

        <button
          v-if="props.images.length > 1"
          class="article-nav right"
          @click.stop.prevent="next()"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
    <div v-if="props.images.length > 1" class="article-bullets">
      <span
        v-for="(img, idx) in props.images"
        :key="idx"
        class="bullet"
        :class="{ active: idx === currentIndex }"
        @click.stop="currentIndex = idx"
      ></span>
    </div>
    <template v-else>
      <div class="thumbs-flex">
        <button v-if="props.items < props.images.length" class="thumb-nav left" @click="thumbPrev">
          ‹
        </button>

        <div class="thumbs-list">
          <div
            v-for="(img, idx) in visibleThumbs"
            :key="thumbStart + idx"
            class="artwork-thumb"
            role="button"
            :aria-label="img?.title || 'Artwork'"
            @click="openAt(thumbStart + idx)"
            tabindex="0"
          >
            <div
              class="thumb-image"
              :style="{ backgroundImage: `url(${props.isArticle ? img : img.src})` }"
            >
              <div class="thumb-overlay"></div>
            </div>
          </div>
        </div>

        <button v-if="props.items < props.images.length" class="thumb-nav right" @click="thumbNext">
          ›
        </button>
      </div>

      <div v-if="props.items < props.images.length" class="thumb-bullets">
        <span
          v-for="(img, idx) in props.images"
          :key="idx"
          class="bullet"
          :class="{ active: idx >= thumbStart && idx < thumbStart + props.items }"
          @click="thumbStart = idx"
        ></span>
      </div>
    </template>
  </div>

  <!-- Modal viewer -->
  <div
    v-if="isOpen"
    class="viewer"
    @click.self="close"
    role="dialog"
    aria-modal="true"
    :aria-label="item?.title || 'Image viewer'"
  >
    <button class="viewer-close" @click="close" :aria-label="t('nav.close') || 'Close'">✕</button>

    <div class="viewer-flex">
      <button class="nav-btn" @click.stop="prev" aria-label="Previous">‹</button>

      <div class="viewer-body">
        <div class="viewer-section">
          <div class="viewer-image" :style="bgStyleFull">
            <div class="image-protector"></div>
          </div>

          <div class="viewer-text" v-if="!props.isArticle && item">
            <h3 class="info-title">{{ item.title }}</h3>
            <div class="info-meta">
              <span v-if="item.year">{{ item.year }}</span>
              <span v-if="item.medium"> • {{ item.medium }}</span>
            </div>
            <p class="info-desc" v-if="item.description">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <button class="nav-btn" @click.stop="next" aria-label="Next">›</button>
    </div>

    <div class="viewer-bullets">
      <span
        v-for="(img, idx) in props.images"
        :key="idx"
        class="bullet"
        :class="{ active: idx === currentIndex }"
        @click="openAt(idx)"
      ></span>
    </div>
  </div>
</template>

<style scoped>
/* FLEX EVERYWHERE */

.thumbnails {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.thumbs-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.thumbs-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
}

.artwork-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 260px;
  height: 260px;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
}
.artwork-thumb:hover {
  transform: scale(1.05);
}

.thumb-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.thumb-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 24px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
}
.thumb-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}
.article-thumb-wrap {
  display: flex;
  flex-direction: column;
}
/* Bullets */
.thumb-bullets,
.article-bullets,
.viewer-bullets {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 12px;
  gap: 8px;
}
.bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background 0.2s;
}
.bullet.active {
  background: #fff;
}

/* Article layout */
.article-thumb-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 16px;
}

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
  border: none;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.article-nav.left {
  left: -68px;
}
.article-nav.right {
  right: -68px;
}
.article-nav:hover {
  background: rgba(0, 0, 0, 0.6);
}

/* Viewer (Modal) */
.viewer {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.9);
  z-index: 1200;
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

.viewer-body {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
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

.viewer-image {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 55%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.viewer-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1 1 45%;
  padding: 40px;
  color: #fff;
  background: rgba(18, 18, 18, 0.9);
}

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

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  font-size: 34px;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 160ms;
}
.nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

@media (max-width: 980px) {
  .viewer-section {
    flex-direction: column;
  }
  .viewer-image {
    height: 50vh;
  }
  .viewer-text {
    padding: 24px;
  }
}
</style>
