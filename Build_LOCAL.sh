# # This Script is used to build the project and run it in a docker container.

echo "Step 0 --> Clean up"
# rm -rf back/src/main/resources/static/*
rm -rf back/target/*
rm -rf taf.war
rm -rf front/dist/*

# # 1. Build Front-end
echo "Step 1 --> Build Front-end"
cd front

# # Compile
# npm install --legacy-peer-deps
npm install
ng build --configuration=production --base-href "."

# # 2. Build Back-end
echo "Step 2 --> Build Back-end"
cd ../back

# # Compile back end
mvn clean package -P prod

# # 3. Build Database
echo "Step 3 --> Build Database"
cd ../db
./compile_db_script.sh

# # 3. Build Docker
docker compose kill
docker compose rm -f
docker compose build
docker compose up