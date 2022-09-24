import { createRouter, createWebHistory } from 'vue-router'
import Trending from './views/Trending.vue'
import Movies from './views/Movies.vue'
import AMovie from './views/AMovie.vue'
import Series from './views/Series.vue'
import ASeries from './views/ASeries.vue'
import err from './views/404.vue'
import Search from './views/Search.vue'
import Person from './views/Person.vue'
import Auth from './views/Auth.vue'
import User from '/src/views/User/User.vue'
import Profile from '/src/views/User/Profile.vue'
import Favourite from '/src/views/User/Favourite.vue'
import { supabase } from './supabase'
import { useStore } from './store'

let routes = [
  { name: 'Trending', path: '/', component: Trending },
  { name: 'Movies', path: '/movies', component: Movies },
  { name: 'AMovie', path: '/movie/:id', component: AMovie },
  { name: 'Series', path: '/series', component: Series },
  { name: 'ASeries', path: '/series/:id', component: ASeries },
  { name: 'Home', path: '/404', component: err },
  { name: 'Search', path: '/search', component: Search },
  { name: 'Person', path: '/person/:id', component: Person },
  {
    name: 'Auth',
    path: '/auth',
    meta: { requiresUnAuth: true },
    component: Auth
  },
  {
    name: 'User',
    path: '/me',
    meta: { requiresAuth: true },
    component: User,
    children: [
      {
        name: 'Profile',
        path: '',
        component: Profile
      },
      {
        name: 'Favourite',
        path: 'fav',
        component: Favourite
      }
    ]
  },
  { name: '404', path: '/:catchAll(.*)', redirect: '/404' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.body.style.overflow = 'overlay'
  const store = useStore()
  const user = supabase.auth.user()
  store.user = user || null

  if ((to.meta.requiresAuth && !user) || (to.meta.requiresUnAuth && user))
    return next({ path: from.fullPath })

  next()
})

export default router
