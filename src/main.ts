import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import '../tailwind.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()

registerSW({})

createApp(App).use(router).use(pinia).mount('#app')
