<script setup>
import './root.css'
import { ref, computed } from 'vue'
import { useLan } from './Languages/LanguagesManager'

const { t, locale, setLocale, locales } = useLan()
const search = ref('')

const current = computed({
  get: () => locale.value,
  set: (v) => setLocale(v),
})

const flagMap = {
  en: '🇬🇧',
  nl: '🇳🇱',
}
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-content">
      <div class="nav-left">
        <a class="nav-item" href="#">{{ t('nav.home') }}</a>
        <a class="nav-item" href="#about">{{ t('nav.about') }}</a>
        <a class="nav-item" href="#contact">{{ t('nav.contact') }}</a>
      </div>

      <div class="nav-right">
        <div class="search" role="search" aria-label="Site search">
          <input id="nav-search" type="search" v-model="search" :placeholder="t('nav.search')" />
          <button type="button" class="search-btn" aria-label="Search">🔍</button>
        </div>

        <div class="lang-switch" aria-label="Language switch">
          <select v-model="current" aria-label="Language">
            <option v-for="l in locales" :key="l" :value="l">
              {{ flagMap[l] || '🏳️' }} {{ l.toUpperCase() }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Use global variables from root.css (do not redeclare :root here) */
.navbar {
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0.18));
  color: var(--text-gray);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
}

/* center nav content and space left / right groups */
.nav-content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 68px;
  padding: 0 1rem;
  gap: 1rem;
  color: var(--text-gray);
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

/* left side links */
.nav-left {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  text-decoration: none;
  color: var(--text-gray);
  font-weight: 600;
  font-size: 16px;
  padding: 8px 10px;
  border-radius: 8px;
  transition:
    color 160ms ease,
    background 160ms ease,
    transform 140ms ease;
}

.nav-item:hover,
.nav-item:focus {
  color: var(--accent);
  background: rgba(255, 255, 255, 0.03);
  transform: translateY(-2px);
}

/* right side */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* search */
.search {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 999px;
  padding: 6px 8px;
  gap: 8px;
  min-width: 180px;
}

.search input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-gray);
  padding: 6px 8px;
  font-size: 14px;
  width: 160px;
}

.search input::placeholder {
  color: var(--muted-gray);
}

.search-btn {
  background: transparent;
  border: none;
  color: var(--text-gray);
  cursor: pointer;
  padding: 4px 6px;
  font-size: 16px;
  border-radius: 6px;
}
.search-btn:hover {
  color: var(--accent);
  background: rgba(255, 255, 255, 0.02);
}

/* language switch */
.lang-switch select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-gray);
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-align: left;
  font-size: 20px;
}

.lang-switch select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
}

/* small screens adjustments */
@media (max-width: 720px) {
  .nav-content {
    height: 60px;
    gap: 0.5rem;
  }
  .nav-left {
    gap: 1rem;
  }
  .search input {
    width: 110px;
  }
  .lang-switch select {
    min-width: 74px;
    padding: 6px 8px;
    font-size: 14px;
  }
}
</style>
