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