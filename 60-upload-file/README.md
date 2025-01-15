# Add Route Service to Import, Create, Find, Edit Ticketing Route

Create route services to manage route record, and also route data can be imported from csv file:

- Add `route` service to import route data from csv file, create, find and edit route.
- Please refer to `/docs/60-upload-file-openapi.yaml` for detail API Contract

- Sample import route file: `/docs/ticket_data.csv`

- This App service and MongoDB service should running on docker and all service running from docker-compose
- docker-compose file should have mongodb service configuration, node app configurations and all config ENV should be declare on the docker-compose configurations.

## Prerequisite

`jwt-authentication` course

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
- Test

  - Import route from file (This feature only accessible for role admin)

        curl -X 'POST' 'http://localhost:10081/api/v1/route/import' \
        -H 'Authorization: Bearer <token>' \
        -H 'Content-Type: application/json' \
        -F 'routeFile=@<file_location>'

  - Create new route (This feature only accessible for role admin)

        curl -X 'POST' 'http://localhost:10081/api/v1/route' \
        -H 'Authorization: Bearer <token>' \
        -H 'Content-Type: application/json' \
        -d '{"from":<from_city>, "to": <destination_city>,"price": <price>,"departureTime": <departure_time>}'

  - Get route with filter

        curl -X 'GET' 'http://localhost:10081/api/v1/route?from=<city>' \
        -H 'Authorization: Bearer <token>' \
        -H 'Content-Type: application/json'

  - Get Route by id

        curl -X 'GET' 'http://localhost:10081/api/v1/route/<route_id>' \
        -H 'Authorization: Bearer <token>' \
        -H 'Content-Type: application/json'

  - Edit route by id (This feature only accessible for role admin)

        curl -X 'PUT' 'http://localhost:10081/api/v1/route/<route_id>' \
        -H 'Authorization: Bearer <token>' \
        -H 'Content-Type: application/json' \
        -d '{"from":<from_city>, "to": <destination_city>,"price": <price>,"departureTime": <departure_time>}'

- Stop services: `docker compose down -t1`
