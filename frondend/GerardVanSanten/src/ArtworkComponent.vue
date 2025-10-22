<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useLan } from './Languages/LanguagesManager'

const { t } = useLan()

const props = defineProps({
  images: { type: Array, required: true }, // [{ src, title, year, medium, description }]
  startIndex: { type: Number, default: 0 },
})

const currentIndex = ref(Math.max(0, Math.min(props.startIndex, props.images.length - 1)))
const isOpen = ref(false)

const item = computed(() => props.images[currentIndex.value] || null)

const bgStyleFull = computed(() => ({
  backgroundImage: item.value ? `url(${item.value.src})` : 'none',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}))

function open() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  window.requestAnimationFrame(() => {
    window.addEventListener('keydown', onKey)
  })
}

// open viewer at specific index (used by thumbnail click)
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
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
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
</script>
<!-- ...existing code... -->
<template>
  <!-- THUMBNAILS GRID: render every image as a clickable thumb that opens viewer at that index -->
  <div class="thumbnails">
    <div
      v-for="(img, idx) in props.images"
      :key="idx"
      class="artwork-thumb"
      role="button"
      :aria-label="img?.title || 'Artwork'"
      @click="openAt(idx)"
      @keydown.enter.prevent="openAt(idx)"
      tabindex="0"
    >
      <div
        class="thumb-image"
        :style="{ backgroundImage: `url(${img.src})` }"
        @contextmenu.prevent
        @dragstart.prevent
      >
        <div class="thumb-overlay" aria-hidden="true"></div>
      </div>
    </div>
  </div>

  <!-- Modal viewer -->
  <div
    v-if="isOpen"
    class="viewer"
    @click.self="close"
    role="dialog"
    aria-modal="true"
    :aria-label="item?.title"
  >
    <button class="viewer-close" @click="close" :aria-label="t('nav.close') || 'Close'">✕</button>

    <button class="nav-btn left" @click.stop="prev" aria-label="Previous">‹</button>

    <div class="viewer-body">
      <div class="viewer-section">
        <div class="viewer-image" :style="bgStyleFull" @contextmenu.prevent @dragstart.prevent>
          <div
            class="image-protector"
            @contextmenu.prevent
            @mousedown.prevent
            @pointerdown.prevent
          ></div>
        </div>

        <div class="viewer-text" v-if="item">
          <h3 class="info-title">{{ item.title }}</h3>
          <div class="info-meta">
            <span v-if="item.year">{{ item.year }}</span>
            <span v-if="item.medium"> • {{ item.medium }}</span>
          </div>
          <p class="info-desc" v-if="item.description">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <button class="nav-btn right" @click.stop="next" aria-label="Next">›</button>
  </div>
</template>

<style scoped>
/* === Thumbnail === */
.artwork-thumb {
  width: 280px;
  height: 280px;
  cursor: pointer;
  display: inline-block;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 220ms;
  user-select: none;
  -webkit-user-drag: none;
  margin: 8px;
}

.thumb-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.artwork-thumb:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

/* === Modal viewer === */
.viewer {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 10, 0.9); /* darker backdrop */
  padding: 36px;
}

.viewer-body {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1100px;
  width: 100%;
}

/* unified section for image + text */
.viewer-section {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  background: rgba(25, 25, 25, 0.95); /* less transparent */
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  height: min(80vh, 800px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
}

/* image side */
.viewer-image {
  flex: 1 1 55%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

/* text side */
.viewer-text {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  padding: 40px;
  color: var(--accent);
  background: rgba(18, 18, 18, 0.9);
}

/* typography */
.info-title {
  margin: 0 0 12px;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

.info-meta {
  margin-bottom: 16px;
  color: #ccc;
  font-size: 1rem;
  font-weight: 500;
}

.info-desc {
  color: #ddd;
  line-height: 1.6;
  font-size: 1.05rem;
  overflow-y: auto;
  max-height: 60%;
  white-space: pre-wrap;
}

/* nav buttons */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1300;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #fff;
  font-size: 34px;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 160ms;
}
.nav-btn.left {
  left: 28px;
}
.nav-btn.right {
  right: 28px;
}
.nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* close button */
.viewer-close {
  position: absolute;
  top: 22px;
  right: 22px;
  z-index: 1400;
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

/* protector overlay */
.image-protector {
  position: absolute;
  inset: 0;
  pointer-events: all;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%);
}

/* responsive */
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
