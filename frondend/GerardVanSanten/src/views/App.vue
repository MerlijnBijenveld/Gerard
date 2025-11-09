<script setup>
import ArtworkComponent from '../components/ArtworkComponent.vue'
import portrait from '../assets/gerard.jpg'
import { onMounted, computed } from 'vue'
import { useLan } from '../Languages/LanguagesManager'
import translations from '../Languages/Languages.json'

const { t, locale } = useLan() // t() available for template

// Prevent dragging/copying hero image
onMounted(() => {
  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('.hero-figure')) e.preventDefault()
  })
})

function sendMail() {
  window.location.href = 'mailto:someone@example.com'
}

// Import all artwork images dynamically
const assets = import.meta.glob('/src/assets/Paintings/*.{jpg,jpeg,png,webp}', { eager: true })

function resolveSrcFromJson(filename) {
  if (!filename) return null
  const fileKey = Object.keys(assets).find((k) => k.endsWith(filename))
  return fileKey ? assets[fileKey].default || assets[fileKey] : null
}

// Computed artworks list from JSON (localized)
const artworks = computed(() => {
  const node = translations[locale.value]?.artworks || {}
  return Object.keys(node)
    .map((k) => {
      const meta = node[k]
      return {
        src: resolveSrcFromJson(meta.src),
        title: meta.title || '',
        year: meta.year || '',
        medium: meta.medium || '',
        description: meta.description || '',
      }
    })
    .filter((a) => a.src)
})
console.log('Artworks loaded:', artworks.value)
</script>

<template>
  <main class="app-main">
    <section class="hero" aria-roledescription="hero">
      <div
        class="hero-figure"
        :style="{ backgroundImage: `url(${portrait})` }"
        @contextmenu.prevent
        @dragstart.prevent
        role="img"
        aria-label="Portrait of the artist"
      >
        <div
          class="image-protector"
          @contextmenu.prevent
          @mousedown.prevent
          @pointerdown.prevent
          aria-hidden="true"
        ></div>
      </div>

      <div class="hero-content">
        <h1 class="title">{{ t('hero.title') }}</h1>
        <p class="subtitle">{{ t('hero.subtitle') }}</p>

        <div class="hero-actions">
          <a class="btn" href="#works">{{ t('hero.viewWorks') }}</a>
          <a class="btn ghost" @click="sendMail">{{ t('hero.contact') }}</a>
        </div>
      </div>
    </section>

    <section id="works" class="content-section">
      <h2>{{ t('featured.heading') }}</h2>
      <p>{{ t('featured.intro') }}</p>

      <div class="gallery">
        <ArtworkComponent :images="artworks" items="3" />
      </div>
    </section>
  </main>
</template>
<style scoped>
/* Root layout */
.app-main {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--accent);
  user-select: none;
  scroll-behavior: smooth;
}

/* ========== HERO SECTION ========== */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 4rem 1.5rem;
  flex-wrap: wrap;
  text-align: center;
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-figure {
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.55);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.hero-figure:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.6);
}

.image-protector {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 20%,
    rgba(0, 0, 0, 0.25) 100%
  );
  pointer-events: all;
}

.hero-content {
  max-width: 600px;
}

.title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 700;
  color: var(--accent);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.subtitle {
  margin: 0 0 1.25rem;
  color: var(--muted-gray);
  font-size: 1.05rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.25rem;
}

.btn {
  display: inline-block;
  padding: 0.7rem 1.3rem;
  background: rgba(255, 255, 255, 0.08);
  color: var(--accent);
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.btn:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
}

.btn:active {
  transform: scale(0.96);
}

.btn.ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* ========== CONTENT SECTION ========== */
.content-section {
  margin-top: 3rem;
  padding: 2rem 1.5rem;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 14px;
  color: var(--accent);
  text-align: center;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
  transition: background 0.3s ease;
}

.content-section:hover {
  background: rgba(0, 0, 0, 0.18);
}

/* ========== GALLERY ========== */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  margin-top: 1.5rem;
  animation: fadeIn 1s ease-in;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    gap: 2rem;
    padding: 3rem 1rem;
  }

  .hero-figure {
    width: 260px;
    height: 260px;
  }

  .title {
    font-size: 1.8rem;
  }
}

@media (max-width: 600px) {
  .hero {
    padding: 2.5rem 1rem;
  }

  .hero-figure {
    width: 200px;
    height: 200px;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .btn {
    width: 100%;
    text-align: center;
  }

  .content-section {
    padding: 1.5rem 1rem;
  }
}
</style>
