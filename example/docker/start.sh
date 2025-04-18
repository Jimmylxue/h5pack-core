docker build -t h5pack-example .

docker run --name my_container -itd h5pack-example

docker exec -it my_container sh -c "
    pwd
    cd /app
    yarn add -D h5pack
    npx h5pack
"

docker cp my_container:/app/app-release.apk ./