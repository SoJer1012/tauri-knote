import { defineComponent } from "vue";
import GlobalProvider from "@/components/AppProvider";
export default defineComponent({
  render() {
    return (
      <GlobalProvider>
        <router-view />
      </GlobalProvider>
    );
  },
});
