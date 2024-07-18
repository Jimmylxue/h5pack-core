<br>

<h1 align="center">Welcome to h5pack 👋</h1>

<br>

即兴的产物，h5pack 是一个跨平台(支持mac/windows)的app打包工具，只需简单的配置和一个指令，即可将 H5 直接打包成 Android APK

## demo

一个常规的网页，可将其打包为一个App

![image-20240718162604678](https://image.jimmyxuexue.top/img/image-20240718162604678.png)

App效果
<video src="https://image.jimmyxuexue.top/video/27_1721291477.mp4"></video>

GitHub:h5pack-core [传送门](https://github.com/Jimmylxue/h5pack-core)

> issues 是第一生产力！😄

知识星球：[传送门](http://www.jimmyxuexue.top)

> 大兄弟们聚过来，这件事很重要 🎉🎉🎉

(如果觉得不错 👍，给个 star ⭐ 吧，你的认可是我最大的动力 ！)

## 使用：

1. 安装

```
pnpm add h5pack
```

2. 配置

项目根目录下新建 `h5pack.json` 并做如下配置：

> 具体配置信息见:[传送门](http://www.jimmyxuexue.top:999/snowtiny/usage/config.html)

```json
{
	"entry": "./dist", // h5项目打包入口
  "name": "newApp", // app包名
	"splash": "./public/vite.svg", // app splash 启动页logo
	"output": "./", // 打包完成后app 输出位置
	"log": false, // 是否开启完整打包日志
}
```

在`package.json` 中增加如下脚本：

```json
"scripts": {
  "compress": "npx h5pack"
}
```

3. 运行

```
npm run compress
```

## 相关依赖

App的打包依赖于另外一个仓库 [h5pack-native](https://github.com/Jimmylxue/h5pack-native) 使用的同学需要安装最基础的安卓环境

- `node20`、`yarn`

- `javaJDK17`
- `Android SDK Platform 34`

具体环境可以看[参考文档](https://reactnative.dev/docs/0.73/environment-setup?platform=android)



## 其他内容

不定期在 B 站直播写代码，欢迎有兴趣的小伙伴们前来围观，期待你们的关注~

[B 站个人主页](https://space.bilibili.com/304985153?spm_id_from=333.1007.0.0)

我有个前端交流群，平时大家一起讨论技术和交流 bug，有兴趣的小伙伴欢迎加入。（vx 添加：ysh15120）
