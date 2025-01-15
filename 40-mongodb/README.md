# Using Mongodb in Node

Using Mongodb in Node. Based on `routing` course:

- Add `mongodb` service. Useful on dev env.
- Use the following additional ENV for mongo server and client
  MONGO_INITDB_ROOT_USERNAME MONGO_INITDB_ROOT_PASSWORD
  MONGODB_URI MONGODB_USER MONGODB_PASS MONGODB_DB

## Prequisite

`routing` course

## Project Acceptance Criteria:

- This API server should be able to save new item data to database and show list of items from database
- This API server should use MongoDB Database
- This App should have item model data schema:

      name: String
      qty : Number

- This App should have controller to proceed request from client
- This App service and MongoDB service should running on docker and all service running from docker-compose
- docker-compose file should have mongodb service configuration, node app configuration and all config ENV should be declare on the docker-compose configurations.
- Request GET to root url should response string:

      Hello Route. Try GET/POST to /api/v1/item

- Request GET to http://{{host}}:{{port}}/api/v1/item should response:

  Response content-type: application/json

  Sample of response body:

        {
            "success": 1,
            "count": 2,
            "data": [
                {
                    "_id": "631b39fed4aa0bf0369ae112",
                    "name": "item1",
                    "qty": 1,
                    "createdAt": "2022-09-09T13:05:02.605Z",
                    "updatedAt": "2022-09-09T13:05:02.605Z",
                    "__v": 0
                },
                {
                    "_id": "631b3a1fd4aa0bf0369ae115",
                    "name": "item2",
                    "qty": 2,
                    "createdAt": "2022-09-09T13:05:35.630Z",
                    "updatedAt": "2022-09-09T13:05:35.630Z",
                    "__v": 0
                }
            ]
        }

- Request POST to http://{{host}}:{{port}}/api/v1/item

  - Request content-type: application/json
  - Have request validation to check request body should have field:
    - name
    - qty
  - Response body if request body don't have name or qty object

    Response content-type: application/json

    Response status: 400 (bad request)

        {
          "message": "\"name\" and \"qty\" cannot be empty"
        }

  - Response body if request body have name and qty object

    Response content-type: application/json

    Response status: 200 (OK)

        {
            "name": "item1",
            "qty": 1,
            "_id": "631b39fed4aa0bf0369ae112",
            "createdAt": "2022-09-09T13:05:02.605Z",
            "updatedAt": "2022-09-09T13:05:02.605Z",
            "__v": 0
        }

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

- create `docker-compose.yaml`

      cp node/docker-compose-example.yaml docker-compose.yaml

- Adjust environment variables on docker-compose.yaml. This will
  be your local configuration,not synced to git. Necessary because
  env variables in dev (including db connection) will be on this file.
- Build and start services:

      docker compose up --build -t1 -d

- Test

  - GET from the host root URL

        curl http://localhost:10081

  - GET from list of items
        curl http://localhost:10081/api/v1/item
  - POST to create new item

        curl -X 'POST' 'http://localhost:10081/api/v1/item' \
        -H 'Content-Type: application/json'
        -d '{"name": "item1","qty": 1}'

- Stop services:

      docker compose down -t1
