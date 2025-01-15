# Using Pagination in Node

Create route services to manage route record, and also route data can be imported from csv file:

- Add pagination when find all user data by filter, able to find data with filtered by page and size per page
- Add pagination when find all item data by filter, able to find data filtered by page and size per page
- Add pagination when find all route data by filter, able to find data with filtered by page and size per page
- This App service and MongoDB service should running on docker and all service running from docker-compose
- docker-compose file should have mongodb service configuration, node app configurations and all config ENV should be declare on the docker-compose configurations.

## Prequisite

`upload file` course

## Directory structure

      - /path/to/base/directory
        - node  => this repo, cloned from git.
                   rename cloned directory name if needed.
        - mongo => persistent directory for mongodb data.
                   this will be automatically created
        - docker-compose.yaml  => copied and adjusted from
                   node/docker-compose-example.yaml
        - upload => persistent directory for upload file data
                    this will be automatically created

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
- Test \

  - Directly to root URL

        curl http://localhost:10081

  - Get all user data (This feature only accessible by role admin)

        curl -X 'GET' 'http://localhost:10081/api/v1/user?name=<name>&page=<pageNumber>&size=<sizePerPage>' \
        -H 'Authorization: Bearer <token>' \
        -H 'Content-Type: application/json'

  - Get all item data

        curl -X 'GET' 'http://localhost:10081/api/v1/item?page=<pageNumber>&size=<sizePerPage>' \
        -H 'Authorization: Bearer <token>' \
        -H 'Content-Type: application/json'

  - Get all route data

        curl -X 'GET' 'http://localhost:10081/api/v1/route?from=<city>&to=<city>&page=<pageNumber>&size=<sizePerPage>' \
        -H 'Authorization: Bearer <token>' \
        -H 'Content-Type: application/json'

- Stop services: `docker compose down -t1`
