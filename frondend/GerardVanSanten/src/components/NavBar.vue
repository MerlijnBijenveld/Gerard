<script setup>
import '../root.css'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLan } from '../Languages/LanguagesManager'
import { useRouter } from 'vue-router'

const { t, locale, setLocale, locales } = useLan()
const router = useRouter()
const search = ref('')

const current = computed({
  get: () => locale.value,
  set: (v) => setLocale(v),
})

const flagMap = { en: '🇬🇧', nl: '🇳🇱' }

/* drawer state + keyboard handlers */
const drawerOpen = ref(false)
function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}
function closeDrawer() {
  drawerOpen.value = false
}
function onKey(e) {
  if (e.key === 'Escape') closeDrawer()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

function navigateAndClose(path) {
  closeDrawer()
  router.push(path)
}
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-content">
      <div class="brand">GVS</div>
      <!-- hamburger shown on small screens -->
      <button
        class="menu-toggle"
        @click="toggleDrawer"
        :aria-expanded="drawerOpen"
        aria-label="Open menu"
      >
        <span class="hamburger" aria-hidden="true"></span>
      </button>
      <!-- left links (desktop) -->
      <div class="nav-left">
        <router-link class="nav-item" to="/">{{ t('nav.home') }}</router-link>
        <router-link class="nav-item" to="/about">{{ t('nav.about') }}</router-link>
        <router-link class="nav-item" to="/media">{{ t('nav.media') }}</router-link>
        <router-link class="nav-item" to="/contact">{{ t('nav.contact') }}</router-link>
      </div>

      <!-- right (search + lang) -->
      <div class="nav-right">
        <div class="search" role="search" aria-label="Site search" v-show="!drawerOpen">
          <input id="nav-search" type="search" v-model="search" :placeholder="t('nav.search')" />
          <button class="search-btn" aria-label="Search">🔍</button>
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

    <!-- full-screen left drawer -->

    <aside
      class="drawer"
      :class="{ open: drawerOpen }"
      role="dialog"
      aria-label="Navigation menu"
      @click.self="closeDrawer"
    >
      <div class="drawer-top">
        <button class="drawer-close" @click="closeDrawer" aria-label="Close menu">✕</button>
      </div>
      <div class="drawer-title">GVS</div>

      <nav class="drawer-nav" aria-label="Mobile navigation">
        <button class="drawer-item" @click="navigateAndClose('/')">
          {{ t('nav.home') }}
        </button>
        <button class="drawer-item" @click="navigateAndClose('/about')">
          {{ t('nav.about') }}
        </button>
        <button class="drawer-item" @click="navigateAndClose('/media')">
          {{ t('nav.media') }}
        </button>
        <button class="drawer-item" @click="navigateAndClose('/contact')">
          {{ t('nav.contact') }}
        </button>
      </nav>

      <div class="drawer-bottom">
        <div class="drawer-divider"></div>
        <div class="drawer-lang">
          <select v-model="current" aria-label="Language">
            <option v-for="l in locales" :key="l" :value="l">
              {{ flagMap[l] || '🏳️' }} {{ l.toUpperCase() }}
            </option>
          </select>
        </div>
      </div>
    </aside>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.16));
  color: var(--text-gray);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  position: relative;
  z-index: 1000;
}

.nav-content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  padding: 0 1rem;
  gap: 1rem;
}

.brand {
  font-weight: 700;
  letter-spacing: 0.06em;
  font-size: 1.05rem;
  color: var(--accent);
}

/* desktop links */
.nav-left {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}
.nav-item {
  text-decoration: none;
  color: var(--text-gray);
  font-weight: 600;
  padding: 8px 10px;
  border-radius: 8px;
  transition: all 0.25s ease;
}
.nav-item:hover {
  color: var(--accent);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

/* right controls */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

/* search */
.search {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  padding: 6px 8px;
  gap: 8px;
  min-width: 180px;
  transition: background 0.25s ease;
}
.search input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-gray);
  padding: 6px 8px;
  width: 160px;
}
.search-btn {
  background: transparent;
  border: none;
  color: var(--text-gray);
  cursor: pointer;
  padding: 4px 6px;
}
.search:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* lang */
.lang-switch select {
  appearance: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-gray);
  padding: 8px 10px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s ease;
}
.lang-switch select:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* hamburger toggle - hidden on desktop, visible on small screens */
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
}
.hamburger {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-gray);
  position: relative;
}
.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--text-gray);
}
.hamburger::before {
  top: -7px;
}
.hamburger::after {
  top: 7px;
}

.drawer {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  max-width: 100%;
  transform: translateX(-100%);
  transition: transform 360ms cubic-bezier(0.22, 0.9, 0.2, 1);
  z-index: 1300;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(12, 12, 12, 0.9), rgba(20, 20, 20, 0.9));
  padding: 22px;
  box-sizing: border-box;
}
.drawer.open {
  transform: translateX(0);
}

/* drawer content */
.drawer-top {
  display: flex;
  justify-content: flex-end;
}
.drawer-close {
  background: transparent;
  border: none;
  color: var(--text-gray);
  font-size: 20px;
  padding: 8px;
  cursor: pointer;
  transition: color 0.25s ease;
}
.drawer-close:hover {
  color: var(--accent);
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 22px;
  padding: 8px 6px;
}
.drawer-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 18px;
  text-transform: uppercase;
}

.drawer-item {
  background: transparent;
  border: none;
  text-align: left;
  color: var(--text-gray);
  font-weight: 700;
  font-size: 1.25rem;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}
.drawer-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 4px;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.3s ease;
}
.drawer-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--accent);
  transform: translateX(6px);
}
.drawer-item:hover::after {
  width: 20px;
}

.drawer-divider {
  height: 1px;
  width: 60%;
  background: rgba(255, 255, 255, 0.1);
  margin: 12px 0;
  border-radius: 1px;
}

/* bottom area with lang */
.drawer-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
}
.drawer-lang select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-gray);
  transition: background 0.25s ease;
}
.drawer-lang select:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* accessibility helper */
.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Responsive rules: collapse into hamburger */
@media (max-width: 700px) {
  .nav-left {
    display: none;
  } /* hide desktop links */
  .menu-toggle {
    display: inline-flex;
  } /* show hamburger */
  .search input {
    width: 110px;
  } /* reduce search width */
}
</style>
