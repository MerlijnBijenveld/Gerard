<script setup>
import translations from '@/Languages/Languages.json'
import { useLan } from '@/Languages/LanguagesManager'
import { computed } from 'vue'
import ArticleList from '@/components/ArticleComponent.vue'

const { t, locale } = useLan()
const title = t('nav.media') || 'Media'

// load article images from src/Assets/Articles and return URL strings
const articleAssets = import.meta.glob('../Assets/Articles/*.{jpg,jpeg,png}', {
  eager: true,
  as: 'url',
})

const articles = computed(() => {
  const node = translations[locale.value]?.articles || {}
  return Object.keys(node).map((key) => {
    const art = node[key]

    // Directly resolve article-${key}.jpg
    const filename = `article-${key}.jpg`
    const match = Object.keys(articleAssets).find((p) => p.toLowerCase().endsWith(`/${filename}`))
    const image = match ? articleAssets[match] : null

    return {
      id: key,
      title: art.title || '',
      date: art.date || '',
      description: art.description || art.desc || '',
      image,
    }
  })
})
</script>

<template>
  <main class="page media">
    <h1>{{ title }}</h1>
    <p>You can find me on various media platforms:</p>
    <ul>
      <li>
        <a href="https://twitter.com/gerardvsanten" target="_blank" rel="noopener">Twitter</a>
      </li>
      <li>
        <a href="https://www.instagram.com/gerardvsanten" target="_blank" rel="noopener"
          >Instagram</a
        >
      </li>
      <li>
        <a href="https://www.linkedin.com/in/gerardvsanten" target="_blank" rel="noopener"
          >LinkedIn</a
        >
      </li>
    </ul>
    <ArticleList :articles="articles" />
  </main>
</template>

<style scoped>
.page {
  padding: 28px;
  color: var(--text-gray);
}
a {
  color: var(--accent);
}
</style>
