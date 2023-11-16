# Project Environnment

## Technologies & Tools

### Database

- MongoDB
- MongoDBCompass (GUI for MongoDB) [(Download)](https://downloads.mongodb.com/compass/mongodb-compass-1.40.2-win32-x64.exe?_ga=2.52666856.1787788633.1695885194-1182748192.1695725186)

### Back-End

- Java 17 [(Download)](https://download.oracle.com/java/17/latest/jdk-17_windows-x64_bin.exe)
- Maven 3.9.4 [(Download)](https://dlcdn.apache.org/maven/maven-3/3.9.4/binaries/apache-maven-3.9.4-bin.zip)


### Front-End

- Node.js 18.18.0 [(Download)](https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi)
- Angular CLI (install with :`npm install -g @angular/cli`)

### Miscellaneous

- Docker & Docker Compose [(Download)](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=dd-smartbutton&utm_location=module)
- Gitlab-CI/CD for pipeline integration

## Docker

This project is deployable with docker. You can find the docker-compose file in the root of the project.

Docker compose will create 2 containers:

- The first one is the database container. It will run a MongoDB instance.

- The second one is the web application container. It will run a Tomcat instance with the front & back applications.

To run the project with docker, you need to have docker and docker-compose installed on your machine.

If so, you can run the following command to start the conatiners:

```bash
docker-compose up
```
For more information about Docker [click here](misc/docker.md)

## MongoDB

MongoDB is a NoSQL database. It is used to store the data of the application.<br>
We use the official MongoDB docker image to run the database.<br>
Our database is composed of 5 collections:

- Business Lines
- Projects
- Readiness Levels
- Teams
- Users

For more information about MongoDB [click here](misc/mongodb.md)

## Gitlab-CI/CD

CI/CD is a continuous method of software development, where you continuously build, test, deploy, and monitor iterative code changes. To use GitLab CI/CD, we must define a .gitlab-ci.yml file at the root of the project which contains the configuration for our CI/CD pipeline. This file follows the YAML format and has its own special syntax.

[Reference](https://docs.gitlab.com/ee/ci/yaml/)

For more information about our Pipeline [click here](misc/gitlab-ci-cd.md)