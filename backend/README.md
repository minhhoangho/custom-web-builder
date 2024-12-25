
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
# NestJS version: 10.2.6
# Requirements

- Node version: v20 or later
- Docker


# Setup

## 1. Install docker/docker-compose and YARN in your machine
## 2. Clone source code from this repository
## 3. Config env file
```bash
$ cp .env.sample .env
```

## 4. Running the app

### Install the packages
```bash
# The process will take some time to install the packages
$ yarn install
```

### Run image and start the container
```bash
# The process will take a few seconds to run the image and start container
$ docker-compose up -d
```

### Run migration script
```bash
# The process will take a few minutes to run all the migration script
$ yarn migration:run
```

## 7. Tracking debug mode
```bash
$ docker-compose logs -f --tail=100 app_server
```

## 8. Migration and seeding

#### There are 2 ways to generate migration files (method 2 is recommended):
- Create migration file manually
```bash
$ CLASS_NAME=<MigrateName> yarn migration:create
```

- Generate migration file from entity
```bash
$ CLASS_NAME=<MigrateName> yarn migration:generate
```

#### Run all migration files
```bash
$ yarn migration:run
```

#### Rollback migration
```bash
$ yarn migration:revert
```

#### Seeding
```bash
# Run all seed files
$ yarn seed:run

# Run specific Class (which defined in src/database/seeds)
$ yarn seed:run -s <ClassName>
```

## 9. Module generator


### a. Nest generate

Run the following script in order

```bash
$ NAME=<module_name> yarn generate:module
```

```bash
$ CLASS_NAME=<CLASS_NAME> DIR=<DIR_NAME> yarn entity:create
```

```bash
$ NAME=<controller_name> yarn generate:controller
```


```bash
$ NAME=<service_name> yarn generate:service
```

### b. Subcriber generate


Run the following script in order

```bash
$ CLASS_NAME=<CLASS_NAME> DIR=<DIR_NAME> yarn subscriber:create
```


Now you can access the API via: ``http://localhost:3000``
API docs: ``http://localhost:3000/docs``


# Contribution

- Author - [Minh Hoang HO](minhhoangho99@gmail.com)



