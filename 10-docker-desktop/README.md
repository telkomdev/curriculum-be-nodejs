# Managing Nodejs Container with Dockerfile

A basic nodejs express webapp, packed as docker container
This project is a simple Hello World web server application develop with NodeJs and Express.

## Project Criteria:

- Web server developed with NodeJS and Express
- Web server should response with string "Hello World" when client request to the server URL
- Web server application should run in docker container

## Prequisite

Docker Desktop or other docker variants working. See `docker desktop` course

## Build & Run Example

- Build container, tag it as `dockerfile-image`

      docker build . -t dockerfile-image
- Run built image, name it `dockerfile-test`

      docker run --name dockerfile-test --rm -d -p 10081:8080 dockerfile-image
- Access web server

      curl http://localhost:10081
- Stop container. Since we start the container with `--rm`, it will be automatically deleted when stopped

      docker kill dockerfile-test
