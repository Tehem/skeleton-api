# Skeleton : API application with Express

This small project is a skeleton for an API application. Characteristics:

- Written in Typescript and using esbuild to run directly from Typescript
- Using express, winston, jest...
- Using Prisma with Mysql for database storage
- Using zod for schema validation from Typescript
- Using Auth0 for identity and authorization

## Development

Create file `.env.development.local`. Adjust the settings for your local development.

```
NODE_ENV=development
```

### Init database

```command
yarn db:init
```

### Run migrations

```command
yarn db:migrate
```

### Create migration

```command
yarn db:prisma migrate dev --name migration_name
```

### Run dev server

You can use the docker-compose file to run a Mysql server for development. Otherwise you need to have a running instance
locally, you can adjust the DB url in your environment file.

```command
docker compose up
yarn dev
```

### Run tests

```command
yarn jest
```

### Run all checks before commit

```command
yarn test
```
