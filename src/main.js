import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "../tailwind.css";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  // onNeedRefresh() {},
  // onOfflineReady() {},
});

createApp(App).use(router).mount("#app");
