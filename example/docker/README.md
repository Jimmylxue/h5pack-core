## Docker 版本

宿主机需先行安装 docker，创建 h5pack.json 文件

之后执行 `start.sh` 即可

效果参考：[打包效果传送门](https://github.com/Jimmylxue/h5pack-core/actions/runs/14530919606)

## 参考指令

- docker build -t h5pack-example .
- docker run -d --name demo h5pack-example tail -f /dev/null
- docker run -it demo bash
