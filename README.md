# h5pack - 跨平台 H5 应用 APP 打包解决方案

## 介绍

h5pack 是一款跨平台应用打包工具（全面支持 macOS 和 Windows），通过简洁的配置文件，即可将任意 H5 应用快速打包成 Android APK。该工具不仅简化了打包流程，更提供了强大的原生平台能力调用接口，让 H5 应用具备原生应用的完整功能。

具体配置以在线文档为准：[h5pack传送门](https://h5pack.jimmyxuexue.top/)


https://github.com/user-attachments/assets/0ea5b29f-849d-46a2-af35-130273b69965



## 效果

一个常规的网页，可将其打包为一个 App

<img width="1615" alt="image" src="https://github.com/user-attachments/assets/9528fa98-7ee1-4b9a-96a5-ec0e1593b126" />

打包效果

<img width="907" alt="image" src="https://github.com/user-attachments/assets/65983db4-b7ca-4e54-939b-22e276e1f0f9" />

App 效果

<img width="802" alt="image" src="https://github.com/user-attachments/assets/482385ca-491f-4c3f-9c5e-7e910daa86a8" />

<img width="1522" height="1680" alt="image" src="https://github.com/user-attachments/assets/982c38a7-3a43-40a5-8cff-1a03afb24b73" />


[视频效果](https://image.jimmyxuexue.top/video/27_1721291477.mp4)

GitHub:h5pack-core [传送门](https://github.com/Jimmylxue/h5pack-core)

> issues 是第一生产力！😄

知识星球：[传送门](http://www.jimmyxuexue.top)

> 大兄弟们聚过来，这件事很重要 🎉🎉🎉

(如果觉得不错 👍，给个 star ⭐ 吧，你的认可是我最大的动力 ！)

## 系统架构与核心原理

```text
┌─────────────────────────────────────────────────────────────┐
│                      h5pack 生态系统                        │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  h5pack-core│ h5pack-native │h5pack-bridge│  h5pack-iconkit│
│   (核心引擎) │ (原生容器)    │ (通信桥梁)   │   (资源生成)     │
└───────┬─────┴───────┬─────┴───────┬─────┴─────────┬───────┘
        │             │             │               │
        └─────────────┼─────────────┼───────────────┘
                      │   协作流程   │
┌─────────────────────▼─────────────▼─────────────────────────┐
│                      打包执行流程                             │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │  读取配置    │───▶│ 资源生成与    │───▶│  应用打包与      │   │
│  │  h5pack.json│    │   注入      │    │     输出         │   │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

h5pack 基于 React Native 技术架构构建，其核心工作机制如下：

- 资源打包机制：将 Web 网页作为静态资源完整打包到 Android App 中

- 容器化加载：App 通过内嵌的 WebView 组件加载打包的 Web 页面，实现 H5 应用 App 化

- 桥接通信系统：通过精心设计的 H5PackBridge 模块，建立 H5 与原生平台之间的双向通信通道

## 优势特点

极简配置：只需简单配置文件，快速完成打包

- 跨平台支持：完美兼容 macOS 和 Windows 和 linux 开发环境

- 原生能力：完整调用 Android 平台原生功能

- 开发便捷：保留 H5 开发效率，享受原生应用体验

## 其他内容

不定期在 B 站直播写代码，欢迎有兴趣的小伙伴们前来围观，期待你们的关注~

[B 站个人主页](https://space.bilibili.com/304985153?spm_id_from=333.1007.0.0)

我有个前端交流群，平时大家一起讨论技术和交流 bug，有兴趣的小伙伴欢迎加入。（vx 添加：ysh15120）
