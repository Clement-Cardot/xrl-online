# Getting Started

# About Us

We are 4 students in our final year of engineering studies at ESEO Angers, France. This is our final year project.
For 5 months we developed this application using the Agile SCRUM method and in constant contact with our client: Thalès Honk Kong.

## Documentation

The documentation is accessible in the folder ./docs<br>
To visualize it in the browser :

1. Install mkdocs :  ```pip install mkdocs mkdocs-material```
2. Run the server :  ```mkdocs serve``` OR ```python -m mkdocs serve```

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


## Build

Use the Build_LOCAL.sh file in a shell env (git bash)

This script will :

1. Remove any artifact from last build
2. Build the Angular app
3. Build the Spring Boot app
4. Build the DB script
5. Deploy Front/Back/BDD with a docker compose

## URL

After build with the previous script, you can access the app with the following URL :

- Front : http://localhost:8080
- Back : http://localhost:8080/api
- Documentation : http://localhost:8080/docs
- BDD : http://localhost:27017