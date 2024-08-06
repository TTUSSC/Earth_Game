import './assets/main.css'
import './scss/styles.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import * as bootstrap from 'bootstrap'
import './assets/color-mode.js'

import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
