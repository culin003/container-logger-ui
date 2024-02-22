import { createApp } from 'vue'
import ViewUIPlus from 'view-ui-plus'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
// import './mock'

const app = createApp(App)

app.use(router)
  .use(store)
  .use(ViewUIPlus)
  .mount('#app')

window.app = app
window.isEmpty = function (str) {
  if (!str) {
    return true
  }

  return str && str.length === 0
}
