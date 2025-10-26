import {
  createRouter,
  createWebHistory,
} from "https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.js";
import HomeView from "../views/App.vue";
import AboutView from "../views/AboutPage.vue";
import MediaView from "../views/MediaPage.vue";
import ContactPage from "@/views/ContactPage.vue";
import ArtworkShowcase from "@/views/ArtworkShowcase.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/media",
    name: "media",
    component: MediaView,
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactPage,
  },
  {
    path: "/artworks",
    name: "artworks",
    component: ArtworkShowcase,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
