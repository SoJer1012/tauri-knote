import { invoke } from "@tauri-apps/api";
import { NButton, NForm, NFormItem, NInput } from "naive-ui";
import { defineComponent, ref } from "vue";
const Greet = defineComponent({
  name: "Greet",
  emits: [],
  setup() {
    const name = ref("");
    const greetMsg = ref("");
    const greet = async () => {
      greetMsg.value = await invoke("greet", { name: name.value });
    };
    return () => {
      return (
        <NForm>
          <NFormItem>
            <NInput placeholder={"Enter a name..."} v-model:value={name.value}></NInput>
            <NButton onClick={greet}>Greet</NButton>
          </NFormItem>
          <NFormItem>
            <p>{greetMsg.value}</p>
          </NFormItem>
        </NForm>
      );
    };
  },
});
export default Greet;
