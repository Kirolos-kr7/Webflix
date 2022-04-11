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
  { path: "/", component: Trending },
  { path: "/movies", component: Movies },
  { path: "/movie/:id", component: AMovie },
  { path: "/series", component: Series },
  { path: "/series/:id", component: ASeries },
  { path: "/404", component: err },
  { path: "/search", component: Search },
  { path: "/person/:id", component: Person },
  { path: "/:catchAll(.*)", redirect: "/404" },
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
