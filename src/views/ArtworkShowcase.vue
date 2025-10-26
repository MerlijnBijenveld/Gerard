<script setup>
import { ref, computed } from 'vue'
import { useLan } from '@/Languages/LanguagesManager'
import translations from '@/Languages/Languages.json'
import ArtworkComponent from '@/components/ArtworkComponent.vue'

// import painting assets (URLs)
const assets = import.meta.glob('/src/assets/Paintings/*.{jpg,jpeg,png,webp}', {
  eager: true,
  as: 'url',
})

function resolveSrcFromJson(filename) {
  if (!filename) return null
  const fileKey = Object.keys(assets).find((k) => k.endsWith(filename))
  return fileKey ? assets[fileKey] : null
}

const { t, locale } = useLan()

// Build artworks array (with type) from translations
const artworks = computed(() => {
  const node = translations[locale.value]?.artworks || {}
  return Object.keys(node)
    .map((k) => {
      const meta = node[k]
      const src = resolveSrcFromJson(meta.src)
      if (!src) return null
      return {
        id: k,
        src,
        title: meta.title || '',
        year: meta.year || '',
        medium: meta.medium || '',
        description: meta.description || '',
        type: meta.type || 'unknown',
      }
    })
    .filter(Boolean)
})

// dynamic list of types (for filter buttons)
const types = computed(() => {
  const list = Array.from(new Set(artworks.value.map((a) => a.type)))
  return ['all', ...list]
})

const selectedType = ref('all')

// grouped by category (keeps sections 'abstract' and 'realism' for layout)
// only include artworks that match selectedType when set
const artworksByCategory = computed(() => {
  const categories = { abstract: [], realism: [] }
  artworks.value.forEach((a) => {
    if (selectedType.value !== 'all' && a.type !== selectedType.value) return
    const cat = a.type === 'realism' ? 'realism' : 'abstract'
    categories[cat].push(a)
  })
  return categories
})
</script>

<template>
  <main class="page artworks-page">
    <div class="header-row">
      <h1>{{ t('nav.artworks') }}</h1>

      <div class="filter-bar" role="tablist" aria-label="Artwork filters">
        <button
          v-for="type in types"
          :key="type"
          :class="['filter-btn', { active: selectedType === type }]"
          @click="selectedType = type"
          :aria-pressed="selectedType === type"
        >
          {{ type === 'all' ? t('nav.artworks') : t(`artCategories.${type}`) || type }}
        </button>
      </div>
    </div>

    <section
      class="category"
      v-if="artworksByCategory.abstract.length"
      aria-labelledby="abstract-heading"
    >
      <h2 id="abstract-heading">{{ t('artCategories.abstract') || 'Abstract' }}</h2>
      <div class="grid">
        <div v-for="art in artworksByCategory.abstract" :key="art.id" class="art-card">
          <ArtworkComponent :images="[art]" :items="1" />
          <div class="card-meta">
            <div class="meta-left">
              <div class="title">{{ art.title }}</div>
              <div class="meta-sub">{{ art.year }} • {{ art.medium }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="category"
      v-if="artworksByCategory.realism.length"
      aria-labelledby="realism-heading"
    >
      <h2 id="realism-heading">{{ t('artCategories.realism') || 'Realism' }}</h2>
      <div class="grid">
        <div v-for="art in artworksByCategory.realism" :key="art.id" class="art-card">
          <ArtworkComponent :images="[art]" :items="1" />
          <div class="card-meta">
            <div class="meta-left">
              <div class="title">{{ art.title }}</div>
              <div class="meta-sub">{{ art.year }} • {{ art.medium }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="!artworks.length" class="empty">No artworks found.</div>
  </main>
</template>

<style scoped>
.page.artworks-page {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
  color: var(--accent);
}
.header-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.filter-bar {
  display: flex;
  gap: 10px;
  align-items: center;
}
.filter-btn {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-gray);
  border-radius: 999px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    background 0.12s ease;
}
.filter-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.07);
}
.filter-btn.active {
  background: var(--accent);
  color: #111;
}

/* Section */
.category {
  margin: 2rem 0;
}
.category h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--accent);
}

/* Responsive grid of cards */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  align-items: start;
}

/* art card wrapper keeps consistent spacing and overlay meta */
.art-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.02));
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}
.art-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

/* meta bar below or overlay for larger screens */
.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));
  color: #fff;
}
.title {
  font-weight: 700;
  color: var(--accent);
}
.meta-sub {
  color: var(--muted-gray);
  font-size: 0.9rem;
}

/* empty state */
.empty {
  text-align: center;
  color: var(--muted-gray);
  padding: 2rem;
}

/* responsive tweaks */
@media (max-width: 760px) {
  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
