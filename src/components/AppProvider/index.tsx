import {
  dateZhCN,
  NConfigProvider,
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  zhCN,
} from "naive-ui";
import { defineComponent } from "vue";
import GlobalInject from "./GlobalInject";

const GlobalProvider = defineComponent({
  name: "GlobalProvider",
  setup(_, { slots }) {
    return () => (
      <NConfigProvider locale={zhCN} dateLocale={dateZhCN}>
        <NDialogProvider>
          <NNotificationProvider>
            <NMessageProvider>
              <NLoadingBarProvider>
                <GlobalInject>{slots.default!()}</GlobalInject>
              </NLoadingBarProvider>
            </NMessageProvider>
          </NNotificationProvider>
        </NDialogProvider>
      </NConfigProvider>
    );
  },
});

export default GlobalProvider;
