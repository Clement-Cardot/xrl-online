[![pipeline status](https://gitlab-etu.openstack.etudis.eseo.fr/s9-pfe-xrl-online/xrl-online/badges/main/pipeline.svg)](https://gitlab-etu.openstack.etudis.eseo.fr/s9-pfe-xrl-online/xrl-online/-/commits/main)
[![coverage report](https://gitlab-etu.openstack.etudis.eseo.fr/s9-pfe-xrl-online/xrl-online/badges/main/coverage.svg)](https://gitlab-etu.openstack.etudis.eseo.fr/s9-pfe-xrl-online/xrl-online/-/commits/main)
# Getting Started

## Development Environment

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


6. Configure VS Code
    - Add extensions :
        - Sonar Lint
        - Docker
        - GitLens
        - Maven

7. Configure IntelliJ
    - Extensions ?

## Build

Use the Build_Script.sh file in a shell env (git bash)

This script will :

1. Remove any artifact from last build
2. Build the Angular app
3. Build the Spring Boot app
4. Deploy Front/Back/BDD with a docker compose