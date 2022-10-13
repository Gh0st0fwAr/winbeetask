// Import Vue
import Vue from 'vue';
import { createApp } from 'vue'
import VueRouter from 'vue-router';

// Import Vue App, routes, store
import App from './App';
import storage from './utils/storage.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCircle, faMagnifyingGlass)

import '@/styles/main.scss';

// import block from './components/block.vue'


let app = createApp(App)
app.mount('#app')
app.component("font-awesome-icon", FontAwesomeIcon)
// app.component('block', block)