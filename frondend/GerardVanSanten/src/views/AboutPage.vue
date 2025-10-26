<script setup>
import { useLan } from '../Languages/LanguagesManager'
import { computed } from 'vue'

const { t } = useLan()

// Make them computed so they re-render when language changes
const aboutTitle = computed(() => t('about.title') || 'About')
const paragraphs = computed(() => t('about.paragraphs') || [])

function formatList(text) {
  return text
    .split(',')
    .map((t) => t.trim())
    .filter(
      (t) =>
        t && !t.toLowerCase().startsWith('biennales') && !t.toLowerCase().startsWith('exposities'),
    )
}
</script>

<template>
  <main class="page about">
    <section class="about-card">
      <transition name="fade-slide">
        <div class="about-header" v-if="aboutTitle">
          <img
            src="../Assets/Gerard.jpg"
            alt="Gerard Van Santen"
            class="about-image"
            @contextmenu.prevent
            @dragstart.prevent
          />
          <div class="about-heading">
            <h1 class="about-title">{{ t('hero.title') }}</h1>
            <div class="about-subtitle">{{ t('hero.subtitle') }}</div>
          </div>
        </div>
      </transition>

      <transition-group name="fade-up" tag="div">
        <!-- Detecteer lijsten aan het begin van een paragraaf -->
        <template v-for="(p, i) in paragraphs" :key="i">
          <ul
            v-if="
              p.trim().startsWith('Biennales') ||
              p.trim().startsWith('Exposities') ||
              p.trim().startsWith('Exhibitions')
            "
            class="about-list"
          >
            <li v-for="line in formatList(p)" :key="line">{{ line }}</li>
          </ul>
          <p
            v-else
            class="about-text"
            :class="{
              'italic text-gray-600': i < 2,
              'about-list-intro':
                p.toLowerCase().includes('biennales') || p.toLowerCase().includes('exposities'),
            }"
          >
            {{ p }}
          </p>
        </template>
      </transition-group>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 20px;
  background: radial-gradient(
    circle at 20% 20%,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.02) 80%
  );
  color: var(--text-gray, #ddd);
}

/* Card styling */
.about-card {
  max-width: 950px;
  width: 100%;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 24px;
  padding: 50px 60px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.about-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 45px rgba(0, 0, 0, 0.45);
}

/* Header with image + text */
.about-header {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.about-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.about-heading {
  flex: 1;
}

.about-title {
  font-size: 2.5rem;
  color: var(--accent, #fff);
  margin: 0;
  font-weight: 700;
}

.about-subtitle {
  font-size: 1.2rem;
  color: var(--muted-gray, #aaa);
  margin-top: 0.5rem;
}

/* Text content */
.about-text {
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  color: var(--text-gray, #ccc);
}

/* Animations */
.fade-slide-enter-active {
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 800px) {
  .about-card {
    padding: 40px 25px;
  }
  .about-header {
    flex-direction: column;
    text-align: center;
  }
  .about-image {
    width: 160px;
    height: 160px;
  }
  .about-title {
    font-size: 2rem;
  }
  .about-subtitle {
    font-size: 1rem;
  }
  .about-text {
    font-size: 1rem;
  }
}
</style>
