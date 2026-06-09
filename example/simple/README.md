## Simple 版本

常规用法，需要开发者自行在宿主环境中安装

App 的打包依赖于另外一个仓库 [h5pack-native](https://github.com/Jimmylxue/h5pack-native) 使用的同学需要安装最基础的安卓环境

- `node20`、`yarn`
- `javaJDK17`
- `Android SDK Platform 34`

具体环境可以看[参考文档](https://reactnative.dev/docs/0.73/environment-setup?platform=android)

### 示例内容

`dist/index.html` 包含以下 Bridge 能力的最小 demo：

- **相机**：拍照、相册选择（返回 base64，直接赋值给 `<img>` 标签）
- **定位**：获取当前经纬度
- **录音**：开始/停止/取消录音，播放/停止播放（原生 MediaPlayer）
