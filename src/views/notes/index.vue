<template>
  <n-split
    v-model:size="splitSize"
    :min="0.15"
    :max="0.85"
    class="h-full w-full"
  >
    <template #1>
      <div class="pr-2 flex flex-col h-full">
        <n-input v-model:value="searchText" round placeholder="搜索">
          <template #suffix>
            <n-icon :component="SearchSharp" />
          </template>
        </n-input>
        <n-dropdown
          trigger="hover"
          :options="options"
          show-arrow
          @select="create"
        >
          <n-button type="primary" dashed class="my-2 w-full">
            <n-icon :component="AddOutline" />
            新建
          </n-button>
        </n-dropdown>
        <n-virtual-list :item-size="42" :items="list" style="flex: 1">
          <template #default="{ item }">
            <div
              :key="item.id"
              class="hover:bg-[#f5f5f5] cursor-pointer p-2 rounded-sm mb-1"
              :class="item.id === active ? 'bg-[#f5f5f5]' : ''"
              @click="selectNote(item)"
              @contextmenu="(e) => handleContextMenu(e, item)"
            >
              <div class="flex gap-2 items-center">
                <n-icon :component="item.icon" size="17" />
                <n-ellipsis class="text-base" style="flex: 1">
                  {{ item.title }}
                </n-ellipsis>
              </div>
              <p class="text-sm text-gray-400">{{ item.date }}</p>
            </div>
          </template>
        </n-virtual-list>
      </div>
    </template>
    <template #2>
      <div v-if="activeNote.id" class="pl-2 w-full h-full flex flex-col">
        <n-skeleton
          v-if="loading"
          height="34px"
          :sharp="false"
          style="width: 60%"
        />
        <n-input
          v-else
          v-model:value="activeNote.title"
          placeholder="标题"
          @blur="titleSave"
        />
        <n-skeleton
          v-if="loading"
          :sharp="false"
          style="width: 100%; flex: 1; margin-top: 3px"
        />
        <MdEditor
          v-else
          v-model="activeNote.content"
          :toolbarsExclude="['link', 'mermaid', 'katex', 'github']"
          style="width: 100%; flex: 1; margin-top: 3px"
          @onUploadImg="onUploadImg"
          @onSave="codeSave"
          @onBlur="codeSave"
        />
      </div>
      <n-empty
        description="未选择笔记"
        class="w-full h-full flex items-center justify-center"
      />
    </template>
  </n-split>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="xRef"
    :y="yRef"
    :options="contextOptions"
    :show="showContext"
    :on-clickoutside="onClickoutside"
    @select="selectContext"
  />
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import {
  NSplit,
  NInput,
  NIcon,
  NEllipsis,
  NButton,
  NDropdown,
  NEmpty,
  NSkeleton,
  NVirtualList,
} from "naive-ui";
import {
  SearchSharp,
  FolderOutline,
  FileTrayFullOutline,
  AddOutline,
} from "@vicons/ionicons5";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { INote, INoteMapping } from "@/types";
import {
  loadNotes,
  saveNotesMapping,
  findNoteContent,
  generateId,
  saveNoteContent,
} from "@/utils";

const options = [
  {
    label: "新建文件",
    key: "file",
  },
  {
    label: "新建文件夹",
    key: "folder",
    disabled: true,
  },
];
const splitSize = ref(0.2);
const searchText = ref("");
const items = ref<INoteMapping[]>([]);
const list = computed(() => {
  return items.value
    .filter((el) => el?.title?.includes(searchText.value))
    .map((el) => {
      return {
        ...el,
        icon: el.type === 1 ? FolderOutline : FileTrayFullOutline,
      };
    });
});

const active = ref("");
const activeNote = ref<INote>({
  id: "",
  title: "",
  content: "",
  type: 2,
});
const showContext = ref(false);
const xRef = ref(0);
const yRef = ref(0);
const contextItem = ref<INoteMapping>();
const loading = ref(false);
const contextOptions = computed(() => {
  if (contextItem.value?.type === 1) {
    return [
      {
        label: "新建文件",
        key: "newFile",
      },
      {
        label: "新建文件夹",
        key: "newFolder",
      },
      {
        label: "重命名",
        key: "rename",
      },
      {
        label: "删除",
        key: "delete",
      },
    ];
  } else {
    return [
      {
        label: "删除",
        key: "delete",
      },
    ];
  }
});
// 新建
const create = (key: string) => {
  let params: INoteMapping | null = null;
  const id = generateId();
  const date = new Date().toLocaleString();
  if (key === "file") {
    params = { id, date, type: 2, title: "无标题笔记" };
    active.value = id;
    activeNote.value = {
      ...params,
      content: "",
    };
  }
  if (key === "folder") {
    params = { id, date, type: 1, title: "新建文件夹", children: [] };
  }
  params && items.value.unshift(params);
  saveNotesMapping(items.value);
};

const handleContextMenu = (e: MouseEvent, item: INoteMapping) => {
  e.preventDefault();
  showContext.value = false;
  contextItem.value = item;
  nextTick().then(() => {
    showContext.value = true;
    xRef.value = e.clientX;
    yRef.value = e.clientY;
  });
};
const onClickoutside = () => {
  showContext.value = false;
};
const selectContext = (key: string | number) => {
  showContext.value = false;
  if (key === "delete") {
    window.$dialog.warning({
      title: "提示",
      content: "确定删除吗？",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        // 从列表中删除
        items.value = items.value.filter(
          (el) => el.id !== contextItem.value?.id
        );
        saveNotesMapping(items.value);
      },
    });
  }
};

// 选择当前笔记
const selectNote = async (item: INoteMapping) => {
  loading.value = true;
  try {
    const { title, type, id } = item;
    if (type === 2) {
      const content = await findNoteContent(id);
      activeNote.value = {
        id,
        title,
        content,
        type,
      };
    }
    active.value = id;
  } finally {
    loading.value = false;
  }
};

// 未完成
const onUploadImg = (files: FileList) => {
  console.log(files);
};

// 标题保存
const titleSave = async () => {
  const { title, id } = activeNote.value;
  const index = items.value.findIndex((el) => el.id === id);
  items.value[index].title = title;
  saveNotesMapping(items.value);
};

// 代码保存
const codeSave = async () => {
  // filename, content
  const { id, content } = activeNote.value;
  const filename = `${id}`;
  await saveNoteContent(filename, content);
  window.$message.success("保存成功");
};

// 初始化
const init = async () => {
  const allNotes = await loadNotes();
  items.value = allNotes?.data ?? [];
};

init();
</script>
