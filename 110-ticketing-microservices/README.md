# Simple Ticketing App Microservices

## Description

This is demo ticketing application build with NodeJS, Express, JWT Authentication, MongoDB, packed as docker container.

`docker-compose` is used to start all needed services during dev.

On prod env, you should not use this docker-compose yml:

- mongodb is usually a separate cluster of multiple servers
- you use kubernetes to manage node containers
- you use vault or kubernetes ENV to manage ENV and secrets

## Architecture Diagram

![Architecture Diagram](https://i.ibb.co/vz3vLGV/Microservices-Ticketing-App-drawio.png)

## API Documentation

Please check /docs for Postman Collection

## Directory structure

      - /path/to/base/directory
        - node  => this repo, cloned from git.
                   rename cloned directory name if needed.
        - mongo => persistent directory for mongodb data.
                   this will be automatically created
        - docker-compose.yaml  => copied and adjusted from
                   node/docker-compose-example.yaml

## Quick Start

- Enter `/path/to/base/directory` (e.g. `~/node/project01`, or
  whatever it is on your setup)
- clone this repo to a directory named `node`, e.g.
  (adjust repo URL as needed)
  git clone https://git-server/path/repo-name.git node
- `cp node/docker-compose-example.yaml docker-compose.yaml`
- Adjust environment variables on docker-compose.yaml. This will
  be your local configuration,not synced to git. Necessary because
  env variables in dev (including db connection) will be on this file.
- Build and start services: `docker compose up --build -t1 -d`
- Test User Service

      curl http://localhost:10081

- Test Route Service

      curl http://localhost:10082

- Test Booking Service

      curl http://localhost:10083

- See swagger yaml and postman collection included in /docs, test it. If
  you follow this readme, adjust server URL to `http://localhost:10081`
- Stop services: `docker compose down -t1`
