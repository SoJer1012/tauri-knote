import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";
declare global {
  declare interface Window {
    // Global vue app instance
    $dialog: import("naive-ui").DialogApi;
    $notification: import("naive-ui").NotificationApi;
    $loadingBar: import("naive-ui").LoadingBarApi;
    $message: MessageApiInjection;
  }
}
