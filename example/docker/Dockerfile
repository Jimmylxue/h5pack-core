FROM ubuntu:latest

# 定义构建参数
ARG NODE_VERSION=20.14.0
ARG JDK_VERSION=17
ARG ANDROID_SDK_VERSION=34
ARG ANDROID_BUILD_TOOLS_VERSION=34.0.0
ARG ANDROID_NDK_VERSION=26.1.10909125
ARG CMAKE_VERSION=3.22.1

# 设置 安卓 环境变量
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_SDK_ROOT}/tools:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin

# 安装必要的工具和 OpenJDK
RUN apt-get update && \
  apt-get install -y openjdk-${JDK_VERSION}-jdk git wget unzip && \
  apt-get clean

# 下载并安装 Android SDK Command-Line Tools
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools && \
  cd ${ANDROID_SDK_ROOT}/cmdline-tools && \
  wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
  unzip commandlinetools-linux-11076708_latest.zip && \
  rm commandlinetools-linux-11076708_latest.zip && \
  mv cmdline-tools latest

# 安装 Android SDK Platform
RUN yes | sdkmanager --sdk_root=${ANDROID_SDK_ROOT} "platforms;android-${ANDROID_SDK_VERSION}"

# 安装 Android SDK Build-Tools
RUN yes | sdkmanager --sdk_root=${ANDROID_SDK_ROOT} "build-tools;${ANDROID_BUILD_TOOLS_VERSION}"

# 安装 cmake
RUN yes | sdkmanager --sdk_root=${ANDROID_SDK_ROOT} "cmake;${CMAKE_VERSION}"

# 安装 ndk
RUN yes | sdkmanager --sdk_root=${ANDROID_SDK_ROOT} "ndk;${ANDROID_NDK_VERSION}"

# 安装 Git
RUN apt-get update && apt-get install -y curl && apt-get clean

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN curl -o node.tar.gz https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz \
  && tar -xzf node.tar.gz -C /usr/local --strip-components=1 \
  && rm node.tar.gz

ENV PATH="/usr/local/bin:${PATH}"

# 设置淘宝镜像 - 这个是可选配置 github-action 自带翻墙 不用配置 如果国内用户本地docker 需要配置一下
RUN npm config set registry https://registry.npmmirror.com

# 安装yarn
RUN npm install -g yarn@1.22.22

# 设置工作目录
WORKDIR /app

COPY . /app

# 暴露应用程序端口（根据需要修改）
EXPOSE 999