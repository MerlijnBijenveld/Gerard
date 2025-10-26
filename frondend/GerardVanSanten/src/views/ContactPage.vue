<script setup>
import { useLan } from '../Languages/LanguagesManager'
import { computed } from 'vue'

const { t } = useLan()

const contactTitle = computed(() => t('contact.title') || 'Contact')
const contactSubtitle = computed(() => t('contact.subtitle') || 'Get in touch')

// Functie voor mailto
function sendMail() {
  window.location.href = 'mailto:info@gerardvansanten.nl?subject=Contact%20via%20website'
}
</script>

<template>
  <main class="page contact">
    <section class="contact-card">
      <transition name="fade-slide">
        <div class="contact-header" v-if="true">
          <img
            src="../Assets/Gerard.jpg"
            alt="Gerard Van Santen"
            class="contact-image"
            @contextmenu.prevent
            @dragstart.prevent
          />
          <div class="contact-heading">
            <h1 class="contact-title">{{ contactTitle }}</h1>
            <p class="contact-subtitle">{{ contactSubtitle }}</p>
          </div>
        </div>
      </transition>

      <transition-group name="fade-up" tag="div" class="contact-body">
        <p class="contact-text">
          {{
            t('contact.intro') ||
            'For inquiries, collaborations, or exhibitions, feel free to reach out through the channels below.'
          }}
        </p>

        <div class="contact-actions">
          <button class="btn" @click="sendMail">{{ t('contact.email') || 'Send Email' }}</button>
          <a
            href="https://www.linkedin.com/in/gerard-van-santen-6a3b058b/"
            target="_blank"
            rel="noopener"
            class="btn ghost"
            >LinkedIn</a
          >
        </div>

        <div class="contact-info">
          <p><strong>Email:</strong> info@gerardvansanten.nl</p>
          <p><strong>Location:</strong> Hilversum, Netherlands</p>
        </div>
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
.contact-card {
  max-width: 850px;
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

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 45px rgba(0, 0, 0, 0.45);
}

/* Header with image + text */
.contact-header {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.contact-image {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.contact-heading {
  flex: 1;
}

.contact-title {
  font-size: 2.4rem;
  color: var(--accent, #fff);
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.contact-subtitle {
  font-size: 1.2rem;
  color: var(--muted-gray, #aaa);
}

/* Text content */
.contact-text {
  font-size: 1.1rem;
  color: var(--text-gray, #ccc);
  line-height: 1.8;
  margin-bottom: 2rem;
  text-align: justify;
}

/* Buttons */
.contact-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.btn {
  background: var(--accent, #fff);
  color: #111;
  border: none;
  border-radius: 8px;
  padding: 12px 26px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background: #ddd;
}

.btn.ghost {
  background: transparent;
  border: 2px solid var(--accent, #fff);
  color: var(--accent, #fff);
}

.btn.ghost:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Contact info */
.contact-info {
  font-size: 1rem;
  color: var(--text-gray, #bbb);
  line-height: 1.6;
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

/* Responsive */
@media (max-width: 800px) {
  .contact-card {
    padding: 40px 25px;
  }
  .contact-header {
    flex-direction: column;
    text-align: center;
  }
  .contact-image {
    width: 160px;
    height: 160px;
  }
  .contact-title {
    font-size: 2rem;
  }
  .contact-subtitle {
    font-size: 1rem;
  }
  .contact-text {
    font-size: 1rem;
  }
}
</style>
