<template>
  <n-split
    v-model:size="splitSize"
    :max="0.85"
    :min="0.15"
    class="h-full w-full"
  >
    <template #1>
      <n-calendar v-model:value="currentDate" class="p-2">
        <template #default="{ year, month, date }">
          <ul
            v-if="
              list[`${year}-${month}-${date}`] &&
              list[`${year}-${month}-${date}`].length > 0
            "
            class="p-2"
            @click.stop
          >
            <li v-for="plan in list[`${year}-${month}-${date}`]">
              <div class="w-full truncate text-sm">
                <n-checkbox v-model:checked="plan.status" />
                {{ plan.content }}
              </div>
            </li>
          </ul>
        </template>
      </n-calendar>
    </template>
    <template #2>
      <div class="h-full flex flex-col">
        <p class="text-xl pl-4">{{ timestampToDate(currentDate) }}计划表</p>
        <ul v-if="currentDatePlan.length > 0" class="flex-1 pl-2 pt-3">
          <li
            v-for="item in currentDatePlan"
            :key="item.content"
            class="w-full text-sm cursor-pointer hover:bg-[#f5f5f5] p-2 rounded-lg"
          >
            <div class="w-full flex items-baseline leading-8">
              <n-checkbox v-model:checked="item.status" class="mr-2" />
              <n-ellipsis class="flex-1" expand-trigger="click" line-clamp="2">
                {{ item.content }}
              </n-ellipsis>
              <n-dropdown
                trigger="hover"
                :options="options"
                show-arrow
                class="ml-2"
                @select="(key:string | number) => handleSelect(key, item)"
              >
                <n-button text style="font-size: 16px">
                  <n-icon>
                    <EllipsisVertical class="mt-1" />
                  </n-icon>
                </n-button>
              </n-dropdown>
            </div>
            <div v-if="item.notifyTime" class="flex items-center text-xs">
              <n-icon>
                <AlarmOutline />
              </n-icon>
              <p class="ml-1">{{ item.notifyTime }} 提醒</p>
            </div>
          </li>
        </ul>

        <n-empty v-else description="暂无计划" class="flex-1 justify-center">
          <template #extra>
            <n-button size="small" type="primary" @click.stop="addPlan">
              新建计划
            </n-button>
          </template>
        </n-empty>
      </div>
    </template>
  </n-split>
  <n-float-button
    v-if="currentDatePlan.length > 0"
    :right="20"
    :bottom="20"
    type="primary"
    @click.stop="addPlan"
  >
    <n-icon>
      <AddOutline />
    </n-icon>
  </n-float-button>
  <n-modal
    v-model:show="visible"
    preset="card"
    :title="title"
    style="width: 400px"
  >
    <Form v-model="model" @submit="submit" />
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  NCalendar,
  NCheckbox,
  NFloatButton,
  NIcon,
  NModal,
  NSplit,
  NEmpty,
  NButton,
  NDropdown,
  NEllipsis,
} from "naive-ui";
import { AddOutline, EllipsisVertical, AlarmOutline } from "@vicons/ionicons5";
import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/api/notification";
import Form from "./form.vue";
import {
  loadPlans,
  savePlans,
  timestampToDate,
  useToggle,
  generateId,
} from "@/utils";
import { IList, IPlan } from "@/types";

const splitSize = ref(0.8);
const currentDate = ref(new Date().getTime());
const list = ref<IList>({});
const currentDatePlan = computed(() => {
  return list.value[timestampToDate(currentDate.value)] ?? [];
});

const [visible, toggle] = useToggle();
const title = ref("新增计划");
const model = ref<IPlan>();
const options = [
  {
    label: "编辑",
    key: "edit",
  },
  {
    label: "删除",
    key: "delete",
  },
];
// 新增计划
const addPlan = () => {
  title.value = "添加计划";
  model.value = {
    id: generateId(),
    content: "",
    status: false,
    needNotify: false,
    notifyTime: null,
  };
  toggle();
};

// 编辑
const handleSelect = (key: string | number, plan: IPlan) => {
  if (key === "edit") {
    title.value = "编辑计划";
    model.value = { ...plan };
  }
  if (key === "delete") {
    window.$dialog.warning({
      title: "提示",
      content: "确定删除吗？",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        const date = timestampToDate(currentDate.value) as string;
        list.value[date] = list.value[date].filter(
          (item) => item.id !== plan.id
        );
      },
    });
  }
  toggle();
};

// 更新数据
const submit = (plan: IPlan) => {
  const date = timestampToDate(currentDate.value) as string;
  if (!list.value[date]) list.value[date] = [];
  // plan是否存在list.value[date]中,如果存在,则更新,否则添加
  if (list.value[date].find((item) => item.id === plan.id)) {
    list.value[date] = list.value[date].map((item) => {
      if (item.id === plan.id) {
        return plan;
      }
      return item;
    });
  } else {
    list.value[date].push(plan);
  }
  toggle();
};

// 设置提醒
const setupReminders = () => {
  const now = new Date();
  Object.keys(list.value).forEach((date) => {
    list.value[date].forEach((plan) => {
      if (plan.needNotify && plan.notifyTime) {
        const [hours, minutes, seconds] = plan.notifyTime
          .split(":")
          .map(Number);
        const [year, month, day] = date.split("-").map(Number);
        const remindTime = new Date(
          year,
          month - 1,
          day,
          hours,
          minutes,
          seconds
        );
        if (remindTime > now) {
          const timeout = remindTime.getTime() - now.getTime();
          setTimeout(async () => {
            sendNotification({ title: "提醒", body: plan.content });
          }, timeout);
        }
      }
    });
  });
};

watch(
  list,
  async (newPlans) => {
    await savePlans(newPlans);
    setupReminders();
  },
  { deep: true }
);

// 初始化
const init = async () => {
  list.value = await loadPlans();
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === "granted";
  }
  if (permissionGranted) {
    setupReminders();
  }
};

init();
</script>
