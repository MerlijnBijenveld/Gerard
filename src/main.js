// ...existing code...
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import App from "./RootComponent.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
