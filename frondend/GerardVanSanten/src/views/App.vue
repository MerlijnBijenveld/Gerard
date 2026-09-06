<script setup>
import ArtworkComponent from '../components/ArtworkComponent.vue'
import portrait from '../assets/gerard.jpg'
import { onMounted, computed } from 'vue'
import { useLan } from '../Languages/LanguagesManager'
import translations from '../Languages/Languages.json'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

const { t, locale } = useLan()

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

onMounted(() => {
  // Scroll smoother setup
  const smoother = ScrollSmoother.create({
    wrapper: '#wrapper',
    content: '#content',
    smooth: 1.5,
    effects: true,
  })
  smoother.effects('.header__image-cont', {
    speed: () => gsap.utils.random(0.55, 0.85, 0.05),
  })
  // Animate swipe divs
  gsap.to('.anim-swipe', {
    yPercent: 300,
    delay: 0.2,
    duration: 2.5,
    stagger: {
      from: 'random',
      each: 0.1,
    },
    ease: 'sine.out',
  })

  // Animate header images on scroll
  gsap.to('.header__image-cont img', {
    scale: 1.3,
    xPercent: 20,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=2000',
      scrub: true,
    },
  })

  // Simple hero title entrance
  gsap.from('.title', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    delay: 0.5,
  })
})
</script>

<template>
  <main id="wrapper">
    <div id="content">
      <!-- Fullscreen header with 4 strips -->
      <section class="header">
        <div class="header__inner">
          <div class="header__image-cont">
            <img src="../Assets/Articles/horizontal_part_1.png" />
            <div class="anim-swipe"></div>
          </div>
          <div class="header__image-cont">
            <img src="../Assets/Articles/horizontal_part_2.png" />
            <div class="anim-swipe"></div>
          </div>
          <div class="header__image-cont">
            <img src="../Assets/Articles/horizontal_part_3.png" />
            <div class="anim-swipe"></div>
          </div>
          <div class="header__image-cont">
            <img src="../Assets/Articles/horizontal_part_4.png" />
            <div class="anim-swipe"></div>
          </div>
        </div>
      </section>

      <!-- Hero section -->
      <section class="hero" aria-roledescription="hero">
        <div
          class="hero-figure"
          :style="{ backgroundImage: `url(${portrait})` }"
          @contextmenu.prevent
          @dragstart.prevent
          role="img"
          aria-label="Portrait of the artist"
        >
          <div class="image-protector" aria-hidden="true"></div>
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

      <!-- Works section -->
      <section id="works" class="content-section">
        <h2>{{ t('featured.heading') }}</h2>
        <p>{{ t('featured.intro') }}</p>

        <div class="gallery">
          <ArtworkComponent :images="artworks" items="3" />
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* Scroll smoother wrapper */
#wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: 0;
  left: 0;
}
#content {
  position: relative;
  width: 100%;
  height: auto;
  overflow: visible;
}

/* Header with 4 strips */
.header {
  height: 100vh;
}
.header__inner {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.header__image-cont {
  position: relative;
  overflow: hidden;
  scale: none;
  width: auto;
}
.header__image-cont:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #111;
  z-index: 999;
}
.header__image-cont img,
.anim-swipe {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: fill;
}
.anim-swipe {
  background-color: #111;
}

/* Hero section */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 4rem 1.5rem;
  flex-wrap: wrap;
  text-align: center;
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
}
.hero-content {
  max-width: 600px;
}
.title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 700;
  color: var(--accent);
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
}
.btn.ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Works section */
.content-section {
  margin-top: 3rem;
  padding: 2rem 1.5rem;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
}
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  margin-top: 1.5rem;
  animation: fadeIn 1s ease-in;
}
</style>
