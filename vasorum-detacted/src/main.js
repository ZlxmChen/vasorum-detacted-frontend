import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/index.css';
// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

//element
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import 'element-plus/theme-chalk/dark/css-vars.css'
import vue3dLoader from "vue-3d-loader";

const myLightTheme = {
  dark: false,
  colors: {
      background: '#F5F5F5FF',
      surface: '#FFFFFF',
      primary: '#657686',
      secondary: '#10E49C',
      error: '#F14668',
      info: '#3E8ED0',
      success: '#48C78EFF',
      warning: '#ffdd80'
  }
}
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'myLightTheme',
    themes: {
      myLightTheme
    }
  }
});
import axios from 'axios';
// axios.defaults.baseURL = 'http://127.0.0.1:4523/m1/3907399-0-default';
axios.defaults.baseURL = 'http://101.42.32.89/api';
const app = createApp(App).use(vuetify).use(ElementPlus).use(router).use(vue3dLoader);
app.mount('#app');

export default app;
