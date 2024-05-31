import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import english from './locales/en.json';
import german from './locales/de.json';


i18next.init({
    lng: window.navigator.language.split('-')[0],
    interpolation: {
        escapeValue: false
    },
    fallbackLng: 'en',
    resources: {
        en:english,
        de:german
    }
});

const app = createApp(App)
app.use(I18NextVue, {i18next});
app.use(router)
app.mount('#planfree');
