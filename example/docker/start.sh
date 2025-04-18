#!/bin/bash
set -e

echo "开始构建 Docker 镜像..."
docker build -t h5pack-example .

echo "启动 Docker 容器..."
docker run --name my_container -d h5pack-example

echo "在容器中执行命令..."
docker exec my_container sh -c "
    echo '当前工作目录:'
    pwd
    echo '切换到 /app 目录...'
    cd /app
    echo '安装 h5pack...'
    yarn add -D h5pack
    echo '执行 h5pack...'
    npx h5pack
" 2>&1 | tee docker_output.log

echo "复制 APK 文件..."
docker cp my_container:/app/app-release.apk ./

echo "清理容器..."
docker rm -f my_container

echo "完成！"