import { createApp } from "vue";
import router, { setupRouter } from './router'

import App from "./App";

import "./styles/index.scss";
import './styles/tailwind.css'

// 启动函数
async function bootstrap() {
  const app = createApp(App)

  // 挂载路由
  setupRouter(app)

  // 路由准备就绪后挂载 APP 实例
  // https://router.vuejs.org/api/interfaces/router.html#isready
  await router.isReady()

  app.mount('#app', true)
}

void bootstrap()
