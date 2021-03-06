import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import axios from 'axios'
import Vuelidate from 'vuelidate'
import './plugins/element.js'

Vue.use(require('vue-moment'))
Vue.use(Vuelidate)
Vue.config.productionTip = false


// Global Axios
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1'
axios.interceptors.request.use(
  (config) => {
    // let token = localStorage.getItem('authtoken');
    let token = store.getters.token

    if (token) {
      config.headers['Authorization'] = `Token ${ token }`;
    }

    return config;
  }, 

  (error) => {
    return Promise.reject(error);
  }
)

// axios.interceptors.request.use(
//   (config) => {
//     store.commit('START_LOADING')
//     return config
//   }, 

//   (error) => {
//     store.commit('STOP_LOADING')
//     return Promise.reject(error);
//   }
// )

// axios.interceptors.response.use(
//   (response) => {
//     store.commit('STOP_LOADING')
//     return response 
//   }, 

//   (error) => {
//     store.commit('STOP_LOADING')
//     return Promise.reject(error);
//   }
// )


// Router
router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth)
  {
    if(!store.getters.authenticated)
    {
      // get path that user is trying to reach before redirecting to login
      const loginpath = window.location.pathname
      next({ 
        name: 'login', 
        query: { from: loginpath }
      })
    }
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
