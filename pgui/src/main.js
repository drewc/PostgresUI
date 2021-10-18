import { createApp } from 'vue'
import App from './App.vue'

import pgAPI from '../../js/pgAPI.js'
window.pgAPI = pgAPI;

createApp(App).mount('#app')
