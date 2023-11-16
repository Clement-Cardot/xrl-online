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