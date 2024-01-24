# Scripts

To make easier the deployement of the project during development we have created two scripts to automated very redundant tasks.

## Build_LOCAL.sh

This script does a build with docker of the entire application and then start it.<br>
To use it, you need to be in a Shell environnment (git bash for example) then run this command : `./build_LOCAL.sh`

This script will :

1. Remove any artifact from last build (remove images, containers, volumes and networks config)
2. Build Front/Back/BDD using docker compose
3. Deploy Front/Back/BDD with a docker compose

**WARNING** : By running this script, you will erase every data from the database, including backups.
If you want to update the application but keep the data, you need to copy your backup in a safe place before running this script !

```sh title="build_LOCAL.sh"
# # This Script is used to build the project and run it in a docker container.
echo "Kill & Clean up last containers & images"
# # Remove previous containers
docker compose down --rmi all -v
# # Build & Start new containers
echo "Build new images"
docker compose build
echo "Start new images"
docker compose up -d
```

## Build_DB.sh

This script is for developpment purpose only. It allows to build the DB and deploy it in a docker container without running the rest of the project.

```sh title="build_DB.sh"
# # This Script is used to build the mongoDB Database and run it in a docker container.
echo "Kill & Clean up last containers & images"
# # Remove previous containers
docker compose down --rmi all -v
# # Build & Start new MongoDB container
echo "Build new image"
docker compose build mongodb
echo "Start new image"
docker compose up -d mongodb
```

## MongoDB Scripts

We have also defined scripts for MongoDB but the documentation is on the [MongoDB Doc Page](mongodb.md)

This script recompile our DB init script with the latest version of our Collections and Insertions