const routes = [
  {
    path: "/",
    redirect: "/schedule",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "schedule",
        name: "Schedule",
        component: () => import("@/views/schedule/index.vue"),
        meta: {
          title: "日程",
        },
      },
      {
        path: "notes",
        name: "Notes",
        component: () => import("@/views/notes/index.vue"),
        meta: {
          title: "笔记",
        },
      },
    ],
  },
];

export default routes;
