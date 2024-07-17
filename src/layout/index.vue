<template>
  <n-layout has-sider class="h-full">
    <n-layout-sider
      collapse-mode="width"
      collapsed
      :collapsed-width="64"
      inverted
    >
      <n-menu
        v-model:value="activeKey"
        collapsed
        inverted
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </n-layout-sider>
    <n-layout class="p-4">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, h, watchEffect } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { MenuOption, NIcon, NMenu, NLayout, NLayoutSider } from "naive-ui";
import { CalendarOutline, NewspaperOutline } from "@vicons/ionicons5";

const route = useRoute();
const activeKey = ref<string | null>("Schedule");

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: { name: "Schedule" },
        },
        { default: () => "日程" }
      ),
    key: "Schedule",
    icon: renderIcon(CalendarOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: { name: "Notes" },
        },
        { default: () => "笔记" }
      ),
    key: "Notes",
    icon: renderIcon(NewspaperOutline),
  },
];

watchEffect(() => {
  activeKey.value = route.name as string;
});
</script>
