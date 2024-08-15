import {createApp} from 'vue';
import App from './App.vue'
import router from "./route";
import dayjs from 'dayjs';
import duration from "dayjs/plugin/duration";
import {createPinia} from 'pinia';

import relativeTime from 'dayjs/plugin/relativeTime';

import 'vant/es/toast/style';
import 'vant/es/dialog/style';

dayjs.extend(relativeTime);
dayjs.extend(duration);


const app = createApp(App);

if (import.meta.env.DEV) {
    localStorage.setItem("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiIyNGE5ZDQyODBmYThmZTFjNDczZDJmNjNiODcwYTQ2NiIsInJuU3RyIjoiWGdxYmc1TWhTOUI0aXhvZDYwT25ZcXB1dnB4VExBWmYifQ.Fy2R8lMK38Zfr8a9Z8UJVow9Fg8umvMA_jWIiEmoEao");
}

app.use(router).use(createPinia()).mount('#app');

