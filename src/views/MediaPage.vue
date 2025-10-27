<script setup>
import translations from '@/Languages/Languages.json'
import { useLan } from '@/Languages/LanguagesManager'
import { computed } from 'vue'
import ArticleList from '@/components/ArticleComponent.vue'

const { t, locale } = useLan()
const title = t('nav.media') || 'Media'

// import all image assets in /Assets/Articles
const articleAssets = import.meta.glob('../Assets/Articles/*.{jpg,jpeg,png,webp}', {
  eager: true,
  as: 'url',
})

/**
 * Each article key in your translations.json (e.g. "news1", "interview2", etc.)
 * will look for:
 *   article-news1.jpg
 *   article-news1_1.jpg
 *   article-news1_2.jpg
 *   article-news1_3.jpg
 * etc.
 */
const articles = computed(() => {
  const node = translations[locale.value]?.articles || {}

  return Object.keys(node).map((key) => {
    const art = node[key]
    const baseName = `article-${key}`

    // find all matching images: article-key.jpg, article-key_1.jpg, article-key_2.jpg ...
    const matches = Object.keys(articleAssets)
      .filter((path) => path.toLowerCase().includes(`/${baseName}`))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    const images = matches.map((m) => articleAssets[m])
    console.log('Article images for', key, images)

    return {
      id: key,
      title: art.title || '',
      date: art.date || '',
      description: art.description || art.desc || '',
      image: images,
    }
  })
})
</script>

<template>
  <main class="page media">
    <h1>{{ title }}</h1>
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
