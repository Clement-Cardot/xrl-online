# This Script is used to build the project and run it in a docker container.

echo "Step 0 --> Clean up"
rm -rf back/src/main/resources/static/*
rm -rf back/target/*
rm -rf taf.war
rm -rf front/dist/front/*

# 1. Build Front-end
echo "Step 1 --> Build Front-end"
cd front

# Compile
npm install --legacy-peer-deps
ng build --configuration=local --base-href "."

# export to back folder
cp -r dist/front/* ../back/src/main/resources/static/

# 2. Build Back-end
echo "Step 2 --> Build Back-end"
cd ../back

# Compile back end
mvn clean package

# put taf.war in main folder
cp target/taf.war ../