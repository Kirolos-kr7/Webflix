import { createRouter, createWebHistory } from "vue-router";
import Trending from "./views/Trending.vue";
import Movies from "./views/Movies.vue";
import AMovie from "./views/AMovie.vue";
import Series from "./views/Series.vue";
import ASeries from "./views/ASeries.vue";
import err from "./views/404.vue";
import Search from "./views/Search.vue";
import Person from "./views/Person.vue";

let routes = [
  { name: "Home", path: "/", component: Trending },
  { name: "Movies", path: "/movies", component: Movies },
  { name: "AMovie", path: "/movie/:id", component: AMovie },
  { name: "Series", path: "/series", component: Series },
  { name: "ASeries", path: "/series/:id", component: ASeries },
  { name: "Home", path: "/404", component: err },
  { name: "Search", path: "/search", name: "search", component: Search },
  { name: "Person", path: "/person/:id", component: Person },
  { name: "404", path: "/:catchAll(.*)", redirect: "/404" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((from, to, next) => {
  document.body.style.overflow = "overlay";
  next();
});

export default router;
