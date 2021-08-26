import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import {routes} from './routes/routes.js'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import {store} from './store/store.js'

Vue.use(VueRouter);

Vue.config.productionTip = false

axios.defaults.baseURL = "https://fullstack-cv.herokuapp.com/api/"
const router = new VueRouter ({
  //Rutas 
  routes,
  mode:"history"
})

new Vue({
  render: h => h(App),
  store,
  vuetify,
  router
}).$mount('#app')
