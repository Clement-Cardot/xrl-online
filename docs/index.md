# Welcome to xRL Online Documentation

[![pipeline status](https://gitlab-etu.openstack.etudis.eseo.fr/s9-pfe-xrl-online/xrl-online/badges/main/pipeline.svg)](https://gitlab-etu.openstack.etudis.eseo.fr/s9-pfe-xrl-online/xrl-online/-/commits/main)
[![coverage report](https://gitlab-etu.openstack.etudis.eseo.fr/s9-pfe-xrl-online/xrl-online/badges/main/coverage.svg)](https://gitlab-etu.openstack.etudis.eseo.fr/s9-pfe-xrl-online/xrl-online/-/commits/main)

## Documentation

The documentation is accessible in the folder ./docs<br>
To visualize it in the browser :

1. Install mkdocs :  ```pip install mkdocs```
2. Run the server :  ```mkdocs serve``` OR ```python -m mkdocs serve```

The documentation is divided in two parts :

- The Dev Documentation
- The Client Documentation

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
