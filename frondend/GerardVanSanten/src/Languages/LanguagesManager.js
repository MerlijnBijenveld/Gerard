import { ref } from 'vue'
import translations from './Languages.json'

const stored = (typeof window !== 'undefined' && localStorage.getItem('locale')) || 'en'
const locale = ref(translations.locales.includes(stored) ? stored : 'en')

function setLocale(l) {
  if (!translations.locales.includes(l)) return
  locale.value = l
  if (typeof window !== 'undefined') localStorage.setItem('locale', l)
}

function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj)
}

// simple interpolator for {var} in strings
function interpolate(str = '', vars = {}) {
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''))
}

function t(path, vars = {}) {
  const node = getByPath(translations[locale.value], path)
  if (node == null) {
    // fallback: try english, then key
    const fallback = getByPath(translations.en, path)
    return interpolate(fallback != null ? fallback : path, vars)
  }
  return typeof node === 'string' ? interpolate(node, vars) : node
}

export function useLan() {
  return {
    t,
    locale,
    setLocale,
    locales: translations.locales,
  }
}
