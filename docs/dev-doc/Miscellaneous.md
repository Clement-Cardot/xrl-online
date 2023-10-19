# Miscellaneous

## Dev Environnement

1. Install JDK 17 : [Download](https://download.oracle.com/java/17/latest/jdk-17_windows-x64_bin.exe)

2. Install Maven : [Maven](https://dlcdn.apache.org/maven/maven-3/3.9.4/binaries/apache-maven-3.9.4-bin.zip)
    - Download Binary (zip for Win tar.gz for Mac)
    - Extract the file in your dev env
    - Add the bin path to your $PATH

<br>

3. Install Node.js : [Download](https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi)

    - Install the Angular CLI :

        - **FOR WINDOWS ONLY**
            >- Start Powershell **with Admin Rights**
            >- Run this : 
            >```powershell
            > Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
            >```
            >- Enter 'O' and tap Enter key


        - Start Terminal and run this :

        ```sh
        npm install -g @angular/cli
        ```

4. Install Docker : [Download](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=dd-smartbutton&utm_location=module)

**IMPORTANT : Cocher "Démarrer au lancement de Windows"**

5. MongoDB Compass (GUI) : [Download](https://downloads.mongodb.com/compass/mongodb-compass-1.40.2-win32-x64.exe?_ga=2.52666856.1787788633.1695885194-1182748192.1695725186)

## Docker

This project is deployable with docker. You can find the docker-compose file in the root of the project.

Docker compose will create 2 containers:

- The first one is the database container. It will run a MongoDB instance.

- The second one is the web application container. It will run a Tomcat instance with the front & back applications.

To run the project with docker, you need to have docker and docker-compose installed on your machine.

Then, you can run the following command:

```bash
docker-compose up
```

## MongoDB

MongoDB is a NoSQL database. It is used to store the data of the application.<br>
We use the official MongoDB docker image to run the database.<br>
Our database is composed of 5 collections:

- Business Lines
- Projects
- Readiness Levels
- Teams
- Users

## CI/CI

The CI/CD is managed by GitLab CI/CD. The configuration file is located in the root of the project.<br>
The pipeline is composed of 4 stages:

- build : Build the front & back applications
- test : Run the unit tests of back-end and the e2e tests with cypress
- sonar : Run the sonar analysis
- deploy : Deploy the application on the dev server // TODO

## Build Script

We have created a build script to test the dev env and build the project.<br>
Use the Build_Script.sh file in a shell env (git bash)

This script will :

1. Remove any artifact from last build
2. Build the Angular app
3. Build the Spring Boot app
4. Build the DB script
5. Deploy Front/Back/BDD with a docker compose