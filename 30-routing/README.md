# Routing with Express in Node

Example of routing with express, adding GET and POST route

## Prequisite

`docker compose` course

## Project Acceptance Criteria:

- Candidate should be able to add new API route to create new item and get item list
- Request GET to root url should response string:

      Hello Route. Try GET/POST to /api/v1/item

- Request GET to http://{{host}}:{{port}}/api/v1/item should response:

  Response content-type: application/json

  Response body:

        {
          "message": "This route is a placeholder that will get all items later"
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
          "message": "This route is a placeholder that will save
          {\"name\":\"item1\",\"qty\":1} later"
        }

## Directory structure

      - /path/to/base/directory
        - node  => this repo, cloned from git.
                   rename cloned directory name if needed.
        - docker-compose.yaml  => copied and adjusted from
                   node/docker-compose-example.yaml

## Quick Start

- Enter `/path/to/base/directory` (e.g. `~/node/project01`, or
  whatever it is on your setup)
- clone this repo to a directory named `node`, e.g.
  (adjust repo URL as needed)
  git clone https://git-server/path/repo-name.git node
- `cp node/docker-compose-example.yaml docker-compose.yaml`
- Adjust environment variables on docker-compose.yaml. On this
  example you can just leave everything as is, as there are no
  secrets yet
- Build and start services:

      docker compose up --build -t1 -d

- Test

  - GET from the host root URL

        curl http://localhost:10081

  - GET from route item url
    curl http://localhost:10081/api/v1/item
  - POST to route item

        curl -X 'POST' 'http://localhost:10081/api/v1/item' \
        -H 'Content-Type: application/json'
        -d '{"name": "item1","qty": 1}'

- Stop services:

      docker compose down -t1
