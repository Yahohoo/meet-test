import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(ElementUI, { locale })

Vue.filter('fullName', (user) => {
  if (!user) return ''
  return `${user.name} ${user.surname}`
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
