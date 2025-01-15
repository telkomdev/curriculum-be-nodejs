# Using JWT Authentication in Node

Using JWT authentication in Node. Based on `mongodb` course:

- Add `user` service to record user data, create admin, create user and login
- Add `auth` middleware to generate token and verify token
- Add Bearer token authentication to access API user/create, item/create
- User entity have data name, email and password (password minimum 6 character)

## Prerequisite

`mongodb` course

## Project Acceptance Criteria:

- In this project we need to create user service with JWT authentication
- Create new role model with schema:

      name: String (unique)

- Create new user model with schema:

      email: String (unique)
      name: String
      password: String (minimal length 6 characters)
      roles: Array of role
      createdAt: Datetime
      updatedAt: Datetime

- Create these 2 roles automatically when the server starts for the first time only.

  Role to be created:

  - admin
  - user

- This User service will have features:

  - Create admin user (need secret-key to access this feature)
  - Login user
  - Get Me (get current login user profile)

  Manage user features, below features only available for role admin:

  - Create user
  - Find all user
  - Find all user filter by name
  - Find user by id
  - Update user by id
  - Delete user by id

- Update existing item routes:

  - Find all items (This feature accessible by public user without authentication)

    Request GET to http://{{host}}:{{port}}/api/v1/item

  - Create new item (Only login user can access this feature )

    Request POST to http://{{host}}:{{port}}/api/v1/item

- Please refer to `/docs/50-node-jwt-openapi.yaml` for the detail API Contract
- This App service and MongoDB service should running on docker and all service running from docker-compose
- docker-compose file should have mongodb service configuration, node app configurations and all config ENV should be declare on the docker-compose configurations.

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
- Test your API with Postman and save your API collection to `/docs/50-node-jwt.postman_collection.json`
- Stop services: `docker compose down -t1`
