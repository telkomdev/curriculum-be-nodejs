# Docker Course with Docker Desktop

Short container introduction using Docker Desktop

## Prequisite
The easiest way (especially if you use Windows/Mac) is to install [docker desktop](https://docs.docker.com/desktop/). Other docker variants should also work, but is not covered here.

## Configuration

### Registry Mirror
Recommended: add registry mirror
- Settings (top right)
![](https://images2.imgbox.com/c8/4b/YYCStNOG_o.png)
- Docker Engine
![](https://images2.imgbox.com/31/44/CDj7TiMw_o.png)
- Registry Mirror
      ,
      "registry-mirrors": [
        "https://mirror.gcr.io"
      ]

## Testing

### Map volume and start web server

We will map a directory on your laptop (e.g. ~/Desktop) to be accssible by containers in /host), then start web server

- Start container. Web server will be available to port 10081 on host
      docker run -d --name hello --rm -p 10081:80 -v ~/Desktop:/host yobasystems/alpine-nginx:stable
- View mapped directory content
      docker exec -it hello ls /mapped
- Access web server
      curl http://localhost:10081
- Stop container. Since we start the container with `--rm`, it will be automatically deleted when stopped
      docker kill hello
