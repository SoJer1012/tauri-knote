# 应用程序功能

这是一个使用 Vue.js 前端框架和 Tauri 桌面应用框架构建的桌面应用程序。
功能一：用户可以创建、更新、删除和查看每日计划，并设置提醒时间。应用程序会发出系统通知来提醒用户。
功能二：用户可以创建、更新、删除和笔记。

## 特性

- **计划管理**：添加、更新、删除和查看每日计划或笔记。
- **提醒通知**：设置提醒时间，到点时通过系统通知提醒用户。
- **数据持久化**：本地存储，所有数据都存储在本机-> download文件夹-> kNote。

## 技术栈

- **前端**：Vue.js 3
- **桌面应用框架**：Tauri
- **构建工具**：Vite


## 安装依赖

首先，确保你的开发环境中已安装 [Node.js](https://nodejs.org/) 和 [Rust](https://www.rust-lang.org/)。然后，安装项目依赖：

```bash
# 安装依赖
pnpm install

# 启动
pnpm tauri dev

# 构建项目
pnpm tauri build
```

## 软件截图

![image](https://github.com/wangshaojie1991/tauri-knote/blob/main/images/1.jpg)
![image](https://github.com/wangshaojie1991/tauri-knote/blob/main/images/2.jpg)
![image](https://github.com/wangshaojie1991/tauri-knote/blob/main/images/3.jpg)
![image](https://github.com/wangshaojie1991/tauri-knote/blob/main/images/4.jpg)
![image](https://github.com/wangshaojie1991/tauri-knote/blob/main/images/5.jpg)