# GES 400 Student Registration/Management Backend

Stack:

- NodeJS
- Typescript
- Express
- MySQL
- Redis
- TypeORM

## Getting Your Dev Environment Ready

**Do not clone this repo directly. Here's what to do:**

- **Fork the repo.**
- **Create a new branch in your fork.**
- **Make changes and push to your branch.**
- **Make a pull request from your branch to the main branch, referencing the issue in the commit message. E.g git commit -m 'fix #2'**

First, install the NodeJS dependencies using yarn by just running

```bash
yarn
```

**Please, don't use npm to install dependencies. We're making use of yarn as it relieves a lot of stress.**

If you don't have yarn, just install yarn using npm:

```bash
npm install --global yarn
```

### Databases

You can use instances of MySQL and Redis already installed on your machine. If you don't have these, you can use docker compose to set them up.

Make sure you have docker and docker-compose installed: https://docs.docker.com/engine/install/.

To spin up the development containers, simply run

```bash
docker compose up
```

or

```bash
docker-compose up
```

This will spin up a MySQL and Redis container.

The Redis default password is: `MDNcVb924a`
MySQL default username and password are: `root`, `root-pw123`

**After setting up your dev dependencies, create a `.env` file to store your credentials for the app.**

You can simply copy and paste these into the `.env` file:

```bash
PORT=8080

APP_ENV=development
APP_SECRET=dsjksjsj
APP_NAME=mgmt-backend
APP_DOMAIN=localhost:3000
APP_LOGO=sjsjs

DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=stud-mgt
DB_USER=root
DB_PASSWORD=root-pw123

TEST_DB_DATABASE=stud-mgt-test
TEST_DB_USER==root
TEST_DB_PASSWORD=root-pw123

REDIS_MODE=single
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=MDNcVb924a

```

If you're using docker compose, this `.env` already contains the default credentials, so you're good to go.

If you're using your own installed databases, update the following in the `.env` file to match your already existing credentials:

- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `REDIS_PASSWORD`
- `REDIS_PORT`
- `REDIS_HOST`

Finally, run:

```bash
yarn dev
```

This will spin up the dev server.

Enjoy!
