import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TinyVue from '@opentiny/vue'
import router from './router'
import App from './App.vue'

import '@opentiny/vue-theme/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(TinyVue)

app.mount('#app')
