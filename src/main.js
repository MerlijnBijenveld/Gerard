// ...existing code...
import { createApp } from 'vue'
import App from './RootComponent.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
