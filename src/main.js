// ...existing code...

import { createApp } from 'vue'
import App from './RootComponent.vue'
import router from '.'

const app = createApp(App)
app.use(router)
app.mount('#app')
