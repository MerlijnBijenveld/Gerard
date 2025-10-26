<script setup>
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import { useLan } from '../Languages/LanguagesManager'
import ButtonComponent from './ButtonComponent.vue'

const { t } = useLan()

const props = defineProps({
  images: { type: Array, required: true },
  startIndex: { type: Number, default: 0 },
  isArticle: { type: Boolean, default: false },
  items: { type: Number, default: 1 },
})

const currentIndex = ref(Math.max(0, Math.min(props.startIndex, props.images.length - 1)))
// displayIndex drives the non-modal thumbnail order so modal navigation doesn't move thumbnails
const displayIndex = ref(currentIndex.value)
const isOpen = ref(false)

watch(
  () => props.images.length,
  (len) => {
    if (currentIndex.value >= len) currentIndex.value = Math.max(0, len - 1)
    if (displayIndex.value >= len) displayIndex.value = Math.max(0, len - 1)
  },
)

// Make item handling robust for both "string" and "{ src: ... }" image entries
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

// Visible thumbnails based on props.items (works with array of strings or objects with .src)
// Uses displayIndex so modal navigation won't reorder thumbnails in non-open mode.
const visibleThumbnails = computed(() => {
  const len = props.images.length
  if (!len) return []
  const count = Math.max(1, Math.floor(props.items) || 1)
  const centerIndex = displayIndex.value
  // if only one requested, show only current (based on displayIndex)
  if (count === 1) {
    const raw = props.images[centerIndex]
    return [{ src: raw?.src || raw, index: centerIndex }]
  }
  const half = Math.floor(count / 2)
  const out = []
  for (let i = 0; i < Math.min(count, len); i++) {
    const idx = (centerIndex - half + i + len) % len
    const raw = props.images[idx]
    out.push({ src: raw?.src || raw, index: idx })
  }
  return out
})

function open() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  window.requestAnimationFrame(() => window.addEventListener('keydown', onKey))
}
function openAt(index) {
  if (index == null || index < 0 || index >= props.images.length) return
  currentIndex.value = index
  // Do NOT change displayIndex here — keep thumbnail order stable while modal is open
  open()
}
// used by non-modal bullets to change selected thumbnail (keeps displayIndex in sync)
function selectIndex(idx) {
  if (idx == null || idx < 0 || idx >= props.images.length) return
  currentIndex.value = idx
  if (!isOpen.value) displayIndex.value = idx
}
function close() {
  isOpen.value = false
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  // optionally sync displayIndex to currentIndex when closing so thumbnails reflect last viewed
  // comment/uncomment next line depending on desired behaviour
  // displayIndex.value = currentIndex.value
}
function prev() {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  displayIndex.value = currentIndex.value
}
function next() {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
  displayIndex.value = currentIndex.value
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

<template>
  <!-- Thumbnails -->
  <div class="thumbnails">
    <div v-if="props.images.length" class="article-thumb-container">
      <div class="article-thumb-wrap">
        <ButtonComponent
          v-if="visibleThumbnails.length !== props.images.length"
          direction="left"
          :images="props.images"
          :width="260"
          :prev="prev"
          :next="next"
        />
        <div class="thumbs-flex" aria-hidden="false">
          <div class="thumbs-list">
            <div
              v-for="thumb in visibleThumbnails"
              :key="thumb.index"
              class="artwork-thumb"
              role="button"
              :aria-label="`Open image ${thumb.index + 1}`"
              @click="openAt(thumb.index)"
              tabindex="0"
            >
              <div
                class="thumb-image"
                :style="{
                  backgroundImage: `url(${thumb.src})`,
                  backgroundSize: 'contain',
                }"
              >
                <div class="thumb-overlay"></div>
              </div>
            </div>
          </div>
        </div>

        <ButtonComponent
          v-if="visibleThumbnails.length !== props.images.length"
          direction="right"
          :images="props.images"
          :width="260"
          :prev="prev"
          :next="next"
        />
      </div>
    </div>
    <div class="row-under-image" v-if="visibleThumbnails.length !== props.images.length">
      <ButtonComponent
        direction="left"
        :images="props.images"
        :width="260"
        :prev="prev"
        :next="next"
      />
      <div v-if="props.images.length > 1" class="article-bullets">
        <span
          v-for="(img, idx) in props.images"
          :key="idx"
          class="bullet"
          :class="{ active: idx === currentIndex }"
          @click.stop="selectIndex(idx)"
        ></span>
      </div>
      <ButtonComponent
        direction="right"
        :images="props.images"
        :width="260"
        :prev="prev"
        :next="next"
      />
    </div>
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
      <ButtonComponent
        direction="left"
        :images="props.images"
        :width="260"
        :prev="prev"
        :next="next"
      />
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
      <ButtonComponent
        direction="right"
        :images="props.images"
        :width="260"
        :prev="prev"
        :next="next"
      />
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
.row-under-image {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
  padding: 6px 0;
}
.row-under-image .article-nav {
  display: none;
  transform: none;
  position: static;
  margin: 0;
}
.article-thumb-wrap .article-nav {
  display: flex;
}
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
  background-repeat: no-repeat;
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
  transform: translateY(-50%);
}

.article-nav:hover {
  background: rgba(0, 0, 0, 0.6);
}

/* Viewer (Modal) */
.viewer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
@media (max-width: 1000px) {
  .viewer-section {
    flex-direction: column;
  }
  .viewer-flex {
    width: 80%;
  }
}
@media (max-width: 600px) {
  .viewer-image {
    height: 50vh;
  }
  .viewer-text {
    padding: 24px;
  }
  .row-under-image .article-nav {
    display: flex;
  }
  .article-thumb-wrap .article-nav {
    display: none;
  }
}
</style>
