# # This Script is used to build the mongoDB Database and run it in a docker container.
echo "Kill & Clean up last containers & images"
# # Remove previous containers
docker compose down --rmi all -v
# # Build & Start new MongoDB container
echo "Build new image"
docker compose build mongodb
echo "Start new image"
docker compose up -d mongodb