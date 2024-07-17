<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="top">
    <n-form-item label="计划内容" path="content">
      <n-input
        v-model:value="model.content"
        placeholder="请输入计划行程"
        type="textarea"
        :autosize="{
          minRows: 3,
          maxRows: 5,
        }"
      />
    </n-form-item>
    <n-form-item path="needNotify" :show-label="false">
      <n-checkbox v-model:checked="model.needNotify">是否需要提醒</n-checkbox>
    </n-form-item>
    <n-form-item v-if="model.needNotify" path="notifyTime" label="通知时间">
      <n-time-picker
        v-model:formatted-value="model.notifyTime"
        value-format="HH:mm:ss"
      />
    </n-form-item>
    <n-button type="primary" @click="confirm"> 确定 </n-button>
  </n-form>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NTimePicker,
  NButton,
  NCheckbox,
} from "naive-ui";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const { modelValue: model } = toRefs(props);
const emits = defineEmits(["submit", "update:modelValue"]);

const formRef = ref();
const rules = {
  content: [
    {
      required: true,
      message: "请输入计划行程",
      trigger: "blur",
    },
  ],
  notifyTime: [
    {
      required: true,
      message: "请选择通知时间",
      trigger: "blur",
    },
  ],
};

const confirm = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors: any) => {
    if (errors) return;
    emits("submit", model.value);
  });
};
</script>
