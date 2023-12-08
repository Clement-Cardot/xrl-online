# # This Script is used to build the project and run it in a docker container.
echo "Kill & Clean up last containers & images"
# # Remove previous containers
docker compose down --rmi all -v
# # Build & Start new containers
echo "Build new images"
docker compose build
echo "Start new images"
docker compose up -d