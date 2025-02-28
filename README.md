# Turborepo Drizzle Postgres Next.js TailwindCSS

You will need Docker, docker-compose, NPM, and Node.js in your machine to run this application.

## How to run the app

In the root folder:

1. Create a new container with the postgres database

```
  docker-compose up --build
```

2. Run the first migration

```
  npm run db:generate
  npm run db:push
```

3. Install all dependecies with npm package manager

```
  npm install
```

4. Run the application in development mode

```
  npm run dev
```

```bash
dashboard:dev:    - Local:        http://localhost:3001
```

```bash
store:dev:    - Local:        http://localhost:3002
```
