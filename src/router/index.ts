import { App } from "vue";
import { createRouter, createWebHistory, Router } from "vue-router";
import routes from "./routes";

const router: Router = createRouter({
  history: createWebHistory("/"),
  routes: routes,
  scrollBehavior(_to: any, _from: any, savedPosition: any) {
    if (savedPosition) {
      return savedPosition; // 使用保存的滚动位置
    } else {
      return { top: 0 }; // 默认滚动到顶部
    }
  },
});

export function setupRouter(app: App) {
  app.use(router);
}

export default router;
