import './assets/main.css'
import './scss/styles.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import * as bootstrap from 'bootstrap'
import './assets/color-mode.js'

const app = createApp(App)

app.use(router)

app.mount('#app')
