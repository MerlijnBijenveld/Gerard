<script setup>
import NavBar from './NavBar.vue'
import Footer from './FooterApp.vue'
import ArtworkComponent from './ArtworkComponent.vue'
import portrait from './assets/gerard.jpg'
import { onMounted, computed } from 'vue'
import { useLan } from './Languages/LanguagesManager'
import translations from './Languages/Languages.json' // lees json direct

const { t, locale } = useLan()

/* protections */
onMounted(() => {
  document.addEventListener('dragstart', (e) => {
    const el = e.target
    if (el && el.closest && el.closest('.hero-figure')) e.preventDefault()
  })
})

function sendMail() {
  window.location.href = 'mailto:someone@example.com'
}

const assets = import.meta.glob('/src/assets/Paintings/*.{jpg,jpeg,png,webp}', { eager: true })

function resolveSrcFromJson(pathSegment) {
  if (!pathSegment) return null
  const key = Object.keys(assets).find((k) => k.endsWith(pathSegment))
  return key ? assets[key].default || assets[key] : null
}

const artworks = computed(() => {
  const node = translations[locale.value]?.artworks || {}
  return Object.keys(node)
    .map((k) => {
      const meta = node[k]
      return {
        src: resolveSrcFromJson(meta.src), // url of null
        title: t(`artworks.${k}.title`),
        year: meta.year || '',
        medium: meta.medium || '',
        description: t(`artworks.${k}.desc`),
      }
    })
    .filter((a) => a.src) // filter eventuele ontbrekende assets
})
</script>

<template>
  <NavBar />

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
        <p class="subtitle">
          {{ t('hero.subtitle') }}
        </p>

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
        <ArtworkComponent :images="artworks" />
      </div>
    </section>
  </main>

  <Footer />
</template>
<style scoped>
.app-main {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--accent);
  user-select: none; /* discourage copy/select */
}
.gallery {
  display: flex;
  justify-content: center;
}
/* HERO */
.hero {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  padding: 4rem 1rem;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
}

/* circular portrait placed center-left on wide screens, stacked on small screens */
.hero-figure {
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  position: relative;
  -webkit-user-drag: none;
  user-drag: none;
  overflow: hidden;
  flex: 0 0 360px;
}

/* invisible overlay that captures pointer events to make right-click/save harder */
.image-protector {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.06) 100%);
  pointer-events: all;
}

/* text block */
.hero-content {
  max-width: 600px;
}

.title {
  margin: 0 0 0.5rem;
  font-size: 2.25rem;
  font-weight: 600;
  color: var(--accent);
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

.subtitle {
  margin: 0 0 1.25rem;
  color: var(--muted-gray);
  font-size: 1.05rem;
  line-height: 1.5;
}

/* actions */
.hero-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 0.75rem;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  color: var(--accent);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition:
    transform 0.12s ease,
    background 0.12s ease;
}

.btn:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.09);
}
.btn.ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* content section */
.content-section {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  color: var(--accent);
}

/* responsive */
@media (max-width: 880px) {
  .hero {
    padding: 2.5rem 1rem;
  }
  .hero-figure {
    width: 260px;
    height: 260px;
    flex: 0 0 260px;
  }
  .title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .hero-figure {
    width: 200px;
    height: 200px;
    flex: 0 0 200px;
  }
  .subtitle {
    font-size: 0.98rem;
  }
}
</style>
