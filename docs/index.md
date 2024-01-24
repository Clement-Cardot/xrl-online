# Welcome to xRL Online Documentation

## Documentation

The documentation is accessible in the folder ./docs<br>
To visualize it in the browser :

1. Install mkdocs :  ```pip install mkdocs```
2. Run the server :  ```mkdocs serve``` OR ```python -m mkdocs serve```

## Project layout

    back/               # Java Spring Back-end
    bdd/                # Dockerfile and JS script for MongoDB server
    docs/               # Documentation
    front/              # Angular web app
    .gitlab-ci.yaml     # CI/CD config for gitlab
    Build_LOCAL.sh      # Build Script which deploy everything with docker compose
    compose.yaml        # Docker compose config file
    Dockerfile          # Docker config file for Front/Back deployement
    mkdocs.yml          # MKdocs config
    README.md       

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