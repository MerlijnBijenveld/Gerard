<script setup>
import { useLan } from './Languages/LanguagesManager'
const year = new Date().getFullYear()
const { t } = useLan()
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <div class="footer-content">
      <div class="footer-text">{{ t('footer.copyright', { year }) }}</div>
      <div class="footer-creator">{{ t('footer.madeBy') }}</div>
    </div>
  </footer>
</template>

<style scoped>
/* ...existing styles... */
</style>
<style scoped>
.site-footer {
  width: 100%;
  color: var(--accent);
}
.footer-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
}
.footer-text {
  font-size: 24px;
}
</style>
