import { ref } from "vue";

export * from "./tools";
export * from "./storage";

export const handleIsTauri = () => {
  return Boolean(
    typeof window !== "undefined" &&
      window !== undefined &&
      window.__TAURI_IPC__ !== undefined
  );
};

export function timestampToDate(timestamp: number, isSeconds = false) {
  let date;
  if (isSeconds) {
    date = new Date(timestamp * 1000);
  } else {
    date = new Date(timestamp);
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}

export function useToggle(init: boolean = false): any {
  const visible = ref(init);
  const toggle = () => {
    visible.value = !visible.value;
  };

  return [visible, toggle];
}
