export interface IPlan {
  id: string;
  // 计划内容
  content: string;
  // 状态是否完成
  status: boolean;
  // 是否需要通知
  needNotify?: boolean;
  // 通知时间
  notifyTime?: null | string;
}

export interface IList {
  [key: string]: IPlan[];
}

export interface INote {
  id: string;
  title: string;
  content: string;
  type: number;
}

export interface INoteMapping {
  id: string;
  title: string;
  date: string;
  type: number;
  children?: any;
}
