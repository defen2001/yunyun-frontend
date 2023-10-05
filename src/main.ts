import router from '@/routers'
import pinia from '@/store'
// Vant 组件样式
import 'vant/es/dialog/style'
import 'vant/es/image-preview/style'
import 'vant/es/notify/style'
import 'vant/es/toast/style'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(router).use(pinia).mount('#app')
