# Scripts

To make easier the deployement of the project during developpment we have created two scripts to automated very redundant tasks.

## Build_LOCAL.sh

We have created a build script to test the dev env and build the project.<br>
Use the Build_LOCAL.sh file in a shell env (git bash)

This script will :

1. Remove any artifact from last build
2. Build the Angular app
3. Build the Spring Boot app
4. Build the DB script
5. Deploy Front/Back/BDD with a docker compose

```sh
# # This Script is used to build the project and run it in a docker container.

# # 1. Cleaning up last artifacts
echo "Step 0 --> Clean up"
# rm -rf back/src/main/resources/static/*
rm -rf back/target/*
rm -rf taf.war
rm -rf front/dist/*

# # 2. Build Front-end
echo "Step 1 --> Build Front-end"
cd front
# # Compile
npm install
ng build --configuration=production --base-href "."

# # 3. Build Back-end
echo "Step 2 --> Build Back-end"
cd ../back
# # Compile back end
mvn clean package -P prod

# # 4. Build Database
echo "Step 3 --> Build Database"
cd ../db
./compile_db_script.sh

# # 5. Build Docker
# # Remove previous containers
docker compose kill
docker compose rm -f
docker system prune -a -f
docker volume prune -f
# # Build & Start new containers
docker compose build
docker compose up
```

## Build_DB.sh

This script is for developpment purpose only. It allows to build the DB and deploy it in a docker container independantly from the rest of the project.

```sh
# # This Script is used to build the mongoDB Database and run it in a docker container.

echo "--> Build Database"
cd db
./compile_db_script.sh

echo "--> Deploy Database Container"
cd ..
# # Remove previous containers
docker compose kill
docker compose rm -f
# # Build & Start new MongoDB container
docker compose build mongodb
docker compose up -d mongodb
```

## compile_db_script.sh

This script recompile our DB init script with the latest version of our Collections and Insertions

```sh
cat init_database.js > mongo-init.js
cat DB_Collections/user.js >> mongo-init.js
cat DB_Collections/team.js >> mongo-init.js
cat DB_Collections/business_line.js >> mongo-init.js
cat DB_Collections/readiness_level.js >> mongo-init.js
cat DB_Collections/project.js >> mongo-init.js
cat DB_Insert/user.js >> mongo-init.js
cat DB_Insert/team.js >> mongo-init.js
cat DB_Insert/business_line.js >> mongo-init.js
cat DB_Insert/readiness_level.js >> mongo-init.js
cat DB_Insert/project.js >> mongo-init.js
```

For more information [Click here](mongodb.md)