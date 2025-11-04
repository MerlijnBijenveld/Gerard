<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/FooterApp.vue'
</script>

<template>
  <NavBar />
  <router-view />
  <Footer />
</template>

<style scoped>
:host {
  display: block;
  padding-top: 8px;
}
</style>
